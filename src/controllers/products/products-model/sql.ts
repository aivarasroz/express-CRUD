const SELECT = `
select 
  h.productId as id,
  h.description,
  h.name,
    json_object(
    'id', u.userId,
    'name', u.name,
    'email', u.email,
  )  as seller, 
  h.price,
  h.quantity,
  if(count(i.imageId) = 0, json_array(), json_arrayagg(i.src)) as images
from product as h
join user as u
on h.userId = u.userId
left join house_image as hi
on h.productId = hi.productId
left join image as i
on hi.imageId = i.imageId
  `;

const GROUP = 'group by h.productId;';

const SQL = {
  SELECT,
  GROUP,
} as const;

export default SQL;
