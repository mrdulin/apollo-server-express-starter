import casual from 'casual';
import shortid from 'shortid';

export const orgId = shortid.generate();
export const locationId1 = shortid.generate();
export const locationId2 = shortid.generate();
export const locationId3 = shortid.generate();

const db = {
  locations: [
    { id: locationId1, orgId, name: casual.address2 },
    { id: locationId2, orgId, name: casual.address2 },
    { id: locationId3, orgId: shortid.generate(), name: casual.address2 }
  ],
  users: [
    {
      id: shortid.generate(),
      name: casual.name,
      email: casual.email,
      orgId: null,
      locationId: locationId1,
      userType: 'ZELO'
    },
    {
      id: shortid.generate(),
      name: casual.name,
      email: casual.email,
      orgId: shortid.generate(),
      locationId: null,
      userType: 'ZEWI'
    },
    { id: shortid.generate(), name: casual.name, email: casual.email, orgId, locationId: null, userType: 'ZOWI' },
    {
      id: shortid.generate(),
      name: casual.name,
      email: casual.email,
      orgId: null,
      locationId: locationId3,
      userType: 'ZOLO'
    }
  ],
  comments: [
    { id: shortid.generate(), content: casual.short_description, shareLocationIds: [locationId1] },
    { id: shortid.generate(), content: casual.short_description, shareLocationIds: [locationId2] }
  ]
};

const findLocationsByOrgId = id => db.locations.filter(location => location.orgId === id);
const findUserByUserType = type => db.users.find(user => user.userType === type);
const findLocationIdsByOrgId = id => findLocationsByOrgId(id).map(loc => loc.id);

export { db, findLocationIdsByOrgId, findLocationsByOrgId, findUserByUserType };
