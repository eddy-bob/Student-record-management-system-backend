import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';
export default function pagination<Type>(
  queryBuilder: SelectQueryBuilder<Type>,
  options: IPaginationOptions,
): Promise<Pagination<Type>> {
  return paginate<Type>(queryBuilder, options);
}
