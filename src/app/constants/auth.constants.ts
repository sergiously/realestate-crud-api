/**
 * All the possible scopes required by the application different URL's
 */
const SCOPES = {
  REALESTATE_READ: 'read.real-estate-post',
  REALESTATE_WRITE: 'write.real-estate-post',
};

/**
 * Mapping of application URL's (including method) to its required scope
 */
const ROUTES_TO_SCOPES_MAPPING = {
  'GET /v1/real-estate-listing/': SCOPES.REALESTATE_READ,
  'POST /v1/real-estate-listing/': SCOPES.REALESTATE_WRITE,
  'PATCH /v1/real-estate-listing/': SCOPES.REALESTATE_WRITE,
  'DELETE /v1/real-estate-listing/': SCOPES.REALESTATE_WRITE,
};


export {
  SCOPES,
  ROUTES_TO_SCOPES_MAPPING,
};
