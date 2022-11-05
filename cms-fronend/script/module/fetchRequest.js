const URL = 'http://localhost:3000/api/';

export const getData = async (postfix, callback, param) => {
  try {
    const response = await fetch(`${URL}${postfix}`);

    if (response.ok) {
      const data = await response.json();
      return callback(data, param);
    }
    if (response.status === 404 ||
      response.status === 422 || response.status >= 500) {
      console.log(response.status);
      return;
    }
    // eslint-disable-next-line max-len
    throw new Error(`Error with status ${response.status} and error message - ${response.statusText}`);
  } catch (error) {
    console.log(error);
  }
};

export const postData = async (data, cb1, cb2) => {
  try {
    const response = await fetch(`${URL}goods`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200 || response.status === 201) {
      const data = await response.json();
      return cb1(cb2(data));
    }

    // eslint-disable-next-line max-len
    throw new Error(`Error with status ${response.status} and error message - ${response.statusText}`);
  } catch (error) {
    console.log(error);
  }
};

export const patchData = async (id, data, cb1) => {
  try {
    const response = await fetch(`${URL}goods/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200 || response.status === 201) {
      const data = await response.json();
      console.log('data from patch: ', data);
      return cb1(data, id);
    }

    // eslint-disable-next-line max-len
    if (response.status === 404 || response.status === 422 || response.status >= 500) {
      return response.statusText;
    }

    // eslint-disable-next-line max-len
    throw new Error(`Error with status ${response.status} and error message - ${response.statusText}`);
  } catch (error) {
    console.log(error);
  }
};
