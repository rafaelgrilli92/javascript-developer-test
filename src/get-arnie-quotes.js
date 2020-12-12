const { httpGet } = require('./mock-http-interface');

/**
 * @param {string[]} urls 
 * @returns {{ ['Arnie Quote' | 'FAILURE']: string }[]}
 */
const getArnieQuotes = async (urls) => {
  const requests = urls.map(url => httpGet(url));
  const responses = await Promise.allSettled(requests); 
  const results = handleResponses(responses);
  
  return results;
};

/**
 * @param {{ status: number, value: string, reason: string }[]} promisesResponse
 * @returns {{ ['Arnie Quote' | 'FAILURE']: string }[]}
 */
const handleResponses = promisesResponse => {
  return promisesResponse.map(res => {
    if (res.status !== 'fulfilled')
      return { FAILURE: res.reason };
      
    const { status, body } = res.value;
    const { message } = JSON.parse(body);
    return { [status === 200 ? 'Arnie Quote' : 'FAILURE']: message };
  });
}

module.exports = {
  getArnieQuotes,
};
