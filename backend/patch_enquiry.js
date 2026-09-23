const fs = require('fs');
let code = fs.readFileSync('src/enquiries/enquiries.service.ts', 'utf8');

code = code.replace(
  "  async create(createEnquiryDto: CreateEnquiryDto, userId?: string) {\n    const enquiry = await this.enquiryModel.create({\n      ...createEnquiryDto,\n      userId,\n    });\n\n    await this.notificationsService.notifyAdmin(\n      'New Enquiry Received',\n      `New enquiry from ${createEnquiryDto.name}`,\n      'NEW_ENQUIRY',\n      enquiry._id.toString(),\n    );\n\n    return enquiry;\n  }",
  `  async create(createEnquiryDto: CreateEnquiryDto, userId?: string) {
    try {
      const enquiry = await this.enquiryModel.create({
        ...createEnquiryDto,
        userId,
      });

      try {
        await this.notificationsService.notifyAdmin(
          'New Enquiry Received',
          \`New enquiry from \${createEnquiryDto.name}\`,
          'NEW_ENQUIRY',
          enquiry._id.toString(),
        );
      } catch (notifyErr) {
        console.warn('Failed to send notification', notifyErr.message);
      }

      return enquiry;
    } catch (err) {
      console.error('Failed to create enquiry in DB:', err);
      throw err;
    }
  }`
);

fs.writeFileSync('src/enquiries/enquiries.service.ts', code);
