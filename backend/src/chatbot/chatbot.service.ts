import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Contact, ContactDocument } from '../contact/schemas/contact.schema';
import { WebsiteContent, WebsiteContentDocument } from '../website-content/schemas/website-content.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
    @InjectModel(WebsiteContent.name) private websiteContentModel: Model<WebsiteContentDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-1.5-flash or gemini-2.0-flash
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        this.logger.log('Gemini AI initialized successfully');
      } catch (err) {
        this.logger.error('Failed to initialize Google Generative AI:', err);
      }
    } else {
      this.logger.warn('GEMINI_API_KEY is not set in environment variables');
    }
  }

  async ask(message: string, userId?: string): Promise<{ reply: string }> {
    const lower = message.toLowerCase();

    // 1. Gather live contextual knowledge dynamically based on intent
    const context = await this.buildContext(lower, userId);

    // If Gemini API is not configured, fallback to rule-based contextual answers
    if (!this.model) {
      return {
        reply: this.generateFallbackResponse(lower, context),
      };
    }

    try {
      const prompt = `
You are the helpful, professional virtual assistant for "New Shree Ganpati Diesel Service" located in Birgunj, Nepal.
Use the following live real-time business context from our database to answer the user's question accurately.

=== BUSINESS CONTEXT ===
${context}
========================

User Query: "${message}"

Guidelines:
1. Speak cordially, concisely, and accurately based ONLY on the context provided above.
2. If the user asks about booking status and their bookings are listed in the context, provide their status clearly.
3. If the user asks for pricing, service details, parts, contact phone, or location, provide the exact details from the context.
4. If the required information is not in the context, politely suggest contacting our workshop at our phone numbers or visiting us in Birgunj.
5. Keep your response brief, friendly, and easy to read (you may use short bullet points if listing services/products).
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return { reply: text };
    } catch (error) {
      this.logger.error('Error querying Gemini API:', error);
      return {
        reply: this.generateFallbackResponse(lower, context),
      };
    }
  }

  private async buildContext(query: string, userId?: string): Promise<string> {
    const sections: string[] = [];

    // Check intents
    const isServiceQuery = /service|repair|crdi|fuel|pump|inject|diagnostic|diesel|check|maintenance/.test(query);
    const isProductQuery = /product|part|spare|price|buy|component|bosch|denso/.test(query);
    const isContactQuery = /contact|phone|call|email|address|location|where|map|hour|open|whatsapp/.test(query);
    const isAboutQuery = /about|who|experience|history|established|story|legacy|year/.test(query);
    const isBookingQuery = /booking|appointment|status|my booking|schedule/.test(query);

    // Fetch contact details (always useful for general info)
    const contact = await this.contactModel.findOne().lean().exec();
    if (contact) {
      sections.push(
        `Contact Information:\n- Address: ${contact.address || 'Birgunj, Parsa, Nepal'}\n- Phone: ${contact.primaryPhone || '+977-9800000000'}${contact.secondaryPhone ? ' / ' + contact.secondaryPhone : ''}\n- WhatsApp: ${contact.whatsapp || 'Available'}\n- Email: ${contact.email || 'info@ganpatidiesel.com'}\n- Opening Hours: ${contact.openingHours || 'Sun - Fri: 9:00 AM - 7:00 PM'}`
      );
    }

    // Fetch website overview
    const websiteContent = await this.websiteContentModel.findOne().lean().exec();
    if (websiteContent && (isAboutQuery || sections.length === 1)) {
      sections.push(
        `Company Background:\n- Overview: ${websiteContent.heroTitle || 'New Shree Ganpati Diesel Service'}\n- Experience: ${websiteContent.yearsExperience || 21}+ years\n- Projects Completed: ${websiteContent.projectsCompleted || 50}+\n- Established Year: ${websiteContent.establishedYear || 2004}\n- About: ${websiteContent.aboutContent || 'Specialists in diesel injection systems, fuel pumps, and advanced CRDI vehicle diagnostics.'}`
      );
    }

    // Fetch Services
    if (isServiceQuery || (!isProductQuery && !isBookingQuery)) {
      const services = await this.serviceModel.find({ isActive: true }).select('name shortDescription description features').limit(10).lean().exec();
      if (services.length > 0) {
        const serviceList = services
          .map((s) => `• ${s.name}: ${s.shortDescription || s.description || ''} ${s.features && s.features.length ? `(Features: ${s.features.join(', ')})` : ''}`)
          .join('\n');
        sections.push(`Available Workshop Services:\n${serviceList}`);
      }
    }

    // Fetch Products
    if (isProductQuery) {
      const products = await this.productModel.find({ isActive: true }).select('name partNumber category price availability description').limit(15).lean().exec();
      if (products.length > 0) {
        const productList = products
          .map((p) => `• ${p.name} (Part #${p.partNumber || 'N/A'}, Category: ${p.category || 'General'}): Price: Rs. ${p.price || 'Contact for quote'}, Available: ${p.availability ? 'Yes' : 'Out of Stock'}`)
          .join('\n');
        sections.push(`Catalog Products & Spare Parts:\n${productList}`);
      }
    }

    // Fetch user-specific bookings if authenticated
    if (userId && isBookingQuery) {
      const bookings = await this.bookingModel.find({ userId }).sort({ createdAt: -1 }).limit(5).lean().exec();
      if (bookings.length > 0) {
        const bookingList = bookings
          .map(
            (b) =>
              `• Booking ID: ${b._id}, Vehicle: ${b.vehicleType || ''} ${b.vehicleModel || ''}, Date: ${b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : 'N/A'}, Status: ${b.status}, Problem: ${b.problemDescription || 'N/A'}`
          )
          .join('\n');
        sections.push(`User's Recent Bookings:\n${bookingList}`);
      } else {
        sections.push(`User's Recent Bookings: No previous bookings found under this customer account.`);
      }
    }

    return sections.join('\n\n');
  }

  private generateFallbackResponse(query: string, context: string): string {
    if (/phone|call|contact|number|reach/.test(query)) {
      return "You can reach New Shree Ganpati Diesel Service directly at +977-9800000000 or via WhatsApp, or visit our workshop in Birgunj, Nepal. Sun-Fri 9:00 AM - 7:00 PM.";
    }
    if (/service|repair|crdi|injector|pump/.test(query)) {
      return "We specialize in Diesel Fuel Injection Pump repair, CRDI Injector diagnostics, Turbocharger servicing, and engine calibration. You can book an appointment directly through our website!";
    }
    if (/product|part|spare|price/.test(query)) {
      return "We supply genuine OEM diesel parts, injectors, fuel pumps, and diagnostic components. Please browse our Products section or contact our workshop for current pricing.";
    }
    if (/booking|appointment|status/.test(query)) {
      return "You can check your bookings under 'My Dashboard' -> 'Bookings' after logging in, or schedule a new service right from our 'Book a Service' page.";
    }
    return "Welcome to New Shree Ganpati Diesel Service! How can I help you today? You can ask about our diesel services, genuine parts, booking an appointment, or contact information.";
  }
}
