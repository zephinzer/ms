import db from '../../db';

const TABLE_USERS = 'users as u';
const TABLE_IMAGES = 'images as i';
const FIELDS_TO_RETRIEVE = [
  'u.uuid',
  'u.email',
  'u.username',
  'u.name_full as nameFull',
  'u.name_first as nameFirst',
  'u.name_last as nameLast',
  'u.name_middle as nameMiddle',
  'u.description',
  'i.uri as imageUri',
  'u.created_at as createdAt',
  'u.updated_at as updatedAt',
];

/**
 * @return {Promise<Array>}
 */
export default function getUserId(userId) {
  return db()
    .select(FIELDS_TO_RETRIEVE)
    .from(TABLE_USERS)
    .where({'u.id': userId})
    .leftOuterJoin(TABLE_IMAGES, 'u.image_id', 'i.id');
};
