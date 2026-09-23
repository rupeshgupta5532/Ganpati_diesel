import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existing = await this.productModel.findOne({
      slug: createProductDto.slug,
    });
    if (existing)
      throw new ConflictException('Product with this slug already exists');

    return this.productModel.create(createProductDto);
  }

  async findAllPublic(category?: string) {
    const filter: any = { isActive: true, availability: true };
    if (category) filter.category = category;

    return this.productModel.find(filter).exec();
  }

  async findAllAdmin() {
    return this.productModel.find().exec();
  }

  async findOneBySlug(slug: string) {
    const product = await this.productModel
      .findOne({ slug, isActive: true })
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updated = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Product not found');
    return { success: true, message: 'Product deleted' };
  }
}
