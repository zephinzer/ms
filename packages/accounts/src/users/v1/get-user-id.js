import db from '../../db';

const TABLE_USERS = 'users as u';
const TABLE_IMAGES = 'images as i';
const FIELDS_TO_RETRIEVE = [
  'u.uuid',
  'u.email',
  'u.username',
  'u.name_full',
  'u.name_first',
  'u.name_last',
  'u.name_middle',
  'u.description',
  'i.uri as image_uri',
  'u.created_at',
  'u.updated_at',
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
