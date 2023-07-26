export const fetchDataWithTimeout = (url, body, method, timeout) => {
  const promiseWithData = new Promise((resolve, reject) => {
    fetch(url, {
      method,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(res => resolve(res))
      .catch(error => reject(error));
  });

  const promiseWithTimeout = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, timeout);
  });

  return Promise.race([promiseWithData, promiseWithTimeout]);
};
