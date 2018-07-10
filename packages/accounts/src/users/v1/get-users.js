import db from '../../db';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const TABLE_USERS = 'users as u';
const TABLE_IMAGES = 'images as i';
const FIELDS_TO_RETRIEVE = [
  'u.uuid',
  'u.email',
  'u.username',
  'u.name_full as nameFull',
  'u.name_first as nameFirst',
  'u.name_last as nameLast',
  'i.uri as imageUri',
  'u.created_at as createdAt',
  'u.updated_at as updatedAt',
];

/**
 * @param {Object} options
 * @param {Number} options.offset
 * @param {Number} options.limit
 * @return {Promise<Array>}
 */
export default function getUsers({
  offset = DEFAULT_OFFSET,
  limit = DEFAULT_LIMIT,
}) {
  return db()
    .select(FIELDS_TO_RETRIEVE)
    .from(TABLE_USERS)
    .leftOuterJoin(TABLE_IMAGES, 'u.image_id', 'i.id')
    .limit(limit > MAX_LIMIT ? MAX_LIMIT : limit)
    .offset(offset);
};
