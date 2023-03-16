const SELECT = `
select 
  u.userId as id,
  u.email,
  u.name,
  u.password,
  i.src as image
from user as u
`;

const SQL = {
  SELECT,
};

export default SQL;
