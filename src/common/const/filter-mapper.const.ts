import {
  Any,
  ArrayContainedBy,
  ArrayContains,
  ArrayOverlap,
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';
/**
 * where__id__not
 *
 * {
 *  where:{
 *      id: Not(value)
 *      }
 * }
 */
export const FILTER_MAPPER = {
  not: Not,
  less_than: LessThan,
  more_than: MoreThan,
  less_than_or_equal: LessThanOrEqual,
  more_than_or_equal: MoreThanOrEqual,
  between: Between,
  in: In,
  is_null: IsNull,
  like: Like,
  i_like: ILike,
  any: Any,
  array_contains: ArrayContains,
  array_contained_by: ArrayContainedBy,
  array_overlap: ArrayOverlap,
  equal: Equal,
};
