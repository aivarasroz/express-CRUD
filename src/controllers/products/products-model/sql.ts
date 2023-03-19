const SELECT = `
select 
  p.id,
  p.description,
  p.name,
    json_object(
    'id', u.userId,
    'name', u.name,
    'email', u.email,
  )  as seller, 
  p.price,
  p.quantity,
  if(count(i.id) = 0, json_array(), json_arrayagg(i.src)) as images
from products as p
join users as u
on p.userId = u.userId
left join product_images as pi
on p.id = pi.productId
left join images as i
on pi.imageId = i.id
`;

const GROUP = 'group by p.id';

const SQL = {
  SELECT,
  GROUP,
} as const;

export default SQL;
