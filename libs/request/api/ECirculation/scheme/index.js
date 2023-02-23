const apis = {
  getSchemeList: { method: 'POST', url: 'scheme/getSchemeList', group: 'ECirculation', dataType: 'keyValue' },
  getSchemeDetail: { method: 'POST', url: 'scheme/getSchemeDetail', group: 'ECirculation', dataType: 'keyValue' },
  getPostionList: { method: 'POST', url: 'scheme/getPostionList', group: 'ECirculation', dataType: 'keyValue' },
  getImageList: { method: 'POST', url: 'scheme/getImageList', group: 'ECirculation', dataType: 'keyValue' },
  updateScheme: { method: 'POST', url: 'scheme/updateScheme', group: 'ECirculation', dataType: 'json' },
  deleteScheme: { method: 'POST', url: 'scheme/deleteScheme', group: 'ECirculation', dataType: 'keyValue' },
  getSchemeState: { method: 'POST', url: 'scheme/getSchemeState', group: 'ECirculation', dataType: 'keyValue' }
}

export default apis
