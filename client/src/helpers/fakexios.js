const headers = { 'Content-Type': 'application/json' };

const fakexios = {
  /**
   * @param {string} url
   */
  get: async (url) => {
    const res = await fetch(url, {
      headers,
    });

    if (res.ok) return await res.json();

    const errorMessage = await res.text();

    throw new Error(errorMessage);
  },
  /**
   * @param {string} url
   * @param {object} _body
   */
  post: async (url, _body) => {
    const res = await fetch(url, {
      method: 'POST',
      headers,
    });

    if (!res.ok) {
      const errorMessage = await res.text();

      throw new Error(errorMessage);
    }
  },
  /**
   * @param {string} url
   */
  delete: async (url) =>
    fetch(url, {
      method: 'DELETE',
      headers,
    }),
};

export default fakexios;
