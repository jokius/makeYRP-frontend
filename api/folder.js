export const createFolder = ({ axios, params }) =>
  axios
    .post('folder', params)
    .then(response => response.data)

export const loadFolder = ({ axios, id }) =>
  axios
    .get(id ? `folders/${id}.json` : 'folder.json')
    .then(response => response.data)

export const updateFolder = ({ axios, params }) =>
  axios
    .put(`folders/${params.id}`, params)
    .then(response => response.data)

export const updateImage = ({ axios, params }) =>
  axios
    .put(`folders/0/images/${params.id}`, params)
    .then(response => response.data)

export const deleteFolder = ({ axios, id }) =>
  axios
    .delete(`folders/${id}`)

export const deleteImage = ({ axios, id }) =>
  axios
    .delete(`folders/0/images/${id}`)

export const loadTree = (axios) =>
  axios
    .get('folders/tree.json')
    .then(response => response.data)
