export async function postJson(url: string, body: object, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  throwOnHttpError(res);
  return await res.json();
}
export async function getJson(url: string, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
  throwOnHttpError(res);
  return await res.json();
}

async function throwOnHttpError(res: Response) {
  if (res.status != 200) {
    throw new Error(`Request failed with status ${res.status} and ${await res.clone().text()}`);
  }
}

export async function poll<Intermediate, Target extends Intermediate>(
  fn: () => Promise<Intermediate>,
  validate: (a: Intermediate) => a is Target,
  interval: number,
  maxAttempts: number
): Promise<Target> {
  let attempts = 0;
  const executePoll = async (resolve: (arg0: Target) => void, reject: (arg0: Error) => void) => {
    const result = await fn();
    attempts++;

    if (validate(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error('Exceeded max attempts'));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };
  return new Promise(executePoll);
}