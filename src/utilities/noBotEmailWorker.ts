const CHUNK_SIZE = 3;
const ASCII_MAX = 128;
const PRIMES = [
    4099, 4111, 4127, 4129, 4133, 4139, 4153, 4157, 4159, 4177, 4201, 4211,
    4217, 4219, 4229, 4231, 4241, 4243, 4253, 4259, 4261, 4271, 4273, 4283,
    4289, 4297, 4327, 4337, 4339, 4349, 4357, 4363, 4373, 4391, 4397, 4409,
    4421, 4423, 4441, 4447, 4451, 4457, 4463, 4481, 4483, 4493, 4507, 4513,
    4517, 4519, 4523, 4547, 4549, 4561, 4567, 4583, 4591, 4597, 4603, 4621,
    4637, 4639, 4643, 4649, 4651, 4657, 4663, 4673, 4679, 4691, 4703, 4721,
    4723, 4729, 4733, 4751, 4759, 4783, 4787, 4789, 4793, 4799, 4801, 4813,
    4817, 4831, 4861, 4871, 4877, 4889, 4903, 4909, 4919, 4931, 4933, 4937,
    4943, 4951, 4957, 4967, 4969, 4973, 4987, 4993, 4999, 5003, 5009, 5011,
    5021, 5023, 5039, 5051, 5059, 5077, 5081, 5087, 5099, 5101, 5107, 5113,
    5119, 5147, 5153, 5167, 5171, 5179, 5189, 5197, 5209, 5227, 5231, 5233,
    5237, 5261, 5273, 5279, 5281, 5297, 5303, 5309, 5323, 5333, 5347, 5351,
    5381, 5387, 5393, 5399, 5407, 5413, 5417, 5419, 5431, 5437, 5441, 5443,
    5449, 5471, 5477, 5479, 5483, 5501, 5503, 5507, 5519, 5521, 5527, 5531,
    5557, 5563, 5569, 5573, 5581, 5591, 5623, 5639, 5641, 5647, 5651, 5653,
    5657, 5659, 5669, 5683, 5689, 5693, 5701, 5711, 5717, 5737, 5741, 5743,
    5749, 5779, 5783, 5791, 5801, 5807, 5813, 5821, 5827, 5839, 5843, 5849,
    5851, 5857, 5861, 5867, 5869, 5879, 5881, 5897, 5903, 5923, 5927, 5939,
    5953, 5981, 5987, 6007, 6011, 6029, 6037, 6043, 6047, 6053, 6067, 6073,
    6079, 6089, 6091, 6101, 6113, 6121, 6131, 6133, 6143, 6151, 6163, 6173,
    6197, 6199, 6203, 6211, 6217, 6221, 6229, 6247, 6257, 6263, 6269, 6271,
    6277, 6287, 6299, 6301, 6311, 6317, 6323, 6329, 6337, 6343, 6353, 6359,
    6361, 6367, 6373, 6379, 6389, 6397, 6421, 6427, 6449, 6451, 6469, 6473,
    6481, 6491, 6521, 6529, 6547, 6551, 6553, 6563, 6569, 6571, 6577, 6581,
    6599, 6607, 6619, 6637, 6653, 6659, 6661, 6673, 6679, 6689, 6691, 6701,
    6703, 6709, 6719, 6733, 6737, 6761, 6763, 6779, 6781, 6791, 6793, 6803,
    6823, 6827, 6829, 6833, 6841, 6857, 6863, 6869, 6871, 6883, 6899, 6907,
    6911, 6917, 6947, 6949, 6959, 6961, 6967, 6971, 6977, 6983, 6991, 6997,
    7001, 7013, 7019, 7027, 7039, 7043, 7057, 7069, 7079, 7103, 7109, 7121,
    7127, 7129, 7151, 7159, 7177, 7187, 7193, 7207, 7211, 7213, 7219, 7229,
    7237, 7243, 7247, 7253, 7283, 7297, 7307, 7309, 7321, 7331, 7333, 7349,
    7351, 7369, 7393, 7411, 7417, 7433, 7451, 7457, 7459, 7477, 7481, 7487,
    7489, 7499, 7507, 7517, 7523, 7529, 7537, 7541, 7547, 7549, 7559, 7561,
    7573, 7577, 7583, 7589, 7591, 7603, 7607, 7621, 7639, 7643, 7649, 7669,
    7673, 7681, 7687, 7691, 7699, 7703, 7717, 7723, 7727, 7741, 7753, 7757,
    7759, 7789, 7793, 7817, 7823, 7829, 7841, 7853, 7867, 7873, 7877, 7879,
    7883, 7901, 7907, 7919, 7927, 7933, 7937, 7949, 7951, 7963, 7993, 8009,
    8011, 8017, 8039, 8053, 8059, 8069, 8081, 8087, 8089, 8093, 8101, 8111,
    8117, 8123, 8147, 8161, 8167, 8171, 8179, 8191,
] as const;

const modPower = (
    base: number | bigint,
    exp: number | bigint,
    mod: number | bigint,
): bigint => {
    const modN = typeof mod === 'bigint' ? mod : BigInt(mod);
    let baseN = typeof base === 'bigint' ? base : BigInt(base);
    let expN = typeof exp === 'bigint' ? exp : BigInt(exp);
    let result = 1n;
    baseN = baseN % modN;
    while (expN > 0n) {
        if (expN % 2n === 1n) result = (result * baseN) % modN;
        expN = expN >> 1n;
        baseN = (baseN * baseN) % modN;
    }
    return result;
};

const rsaEncrypt = (
    message: Uint8Array,
    e: number | bigint,
    n: number | bigint,
): bigint => {
    let number = 0n;
    for (let i = 0; i < message.length; i++) {
        number = (number << 8n) | BigInt(message[i]);
    }
    const encrypted = modPower(number, BigInt(e), BigInt(n));
    return encrypted;
};

const chunkBruteForce = async (
    cipherText: bigint,
    n: number,
    e: number,
): Promise<Uint8Array | null> => {
    const current = Array(CHUNK_SIZE).fill(0);

    while (true) {
        const message = new Uint8Array(current);
        const encrypted = rsaEncrypt(message, e, n);

        if (encrypted === cipherText) {
            return message;
        }

        // Increment the current chunk
        let i = 0;
        while (i < CHUNK_SIZE) {
            current[i]++;
            if (current[i] < ASCII_MAX) {
                break; // Incremented successfully
            }
            current[i] = 0; // Reset and carry over to the next byte
            i++;
        }

        if (i === CHUNK_SIZE) {
            // We've exhausted all combinations for this chunk
            return null;
        }
    }
};

const generateSmallRSAKey = () => {
    const p = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    let q = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    while (q === p) q = PRIMES[Math.floor(Math.random() * PRIMES.length)];
    const n = p * q;
    const e = 17;
    return { n, e };
};

const encryptEmail = async (
    email: string,
): Promise<
    Array<{
        cipherText: string;
        e: number;
        n: number;
    }>
> => {
    const emailBytes = new TextEncoder().encode(email);

    const paddedLength = Math.ceil(emailBytes.length / CHUNK_SIZE) * CHUNK_SIZE;
    const paddedEmailBytes = new Uint8Array(paddedLength);
    paddedEmailBytes.set(emailBytes);

    const chunks: Array<{
        cipherText: string;
        e: number;
        n: number;
    }> = [];

    for (let i = 0; i < paddedEmailBytes.length; i += CHUNK_SIZE) {
        const chunkBytes = paddedEmailBytes.slice(i, i + CHUNK_SIZE);
        const { n, e } = generateSmallRSAKey();
        const cipher = rsaEncrypt(chunkBytes, e, n);
        chunks.push({
            cipherText: cipher.toString(),
            e,
            n,
        });
    }

    return chunks;
};

const decryptEmail = async (
    cipherTexts: Array<{
        cipherText: string;
        e: number;
        n: number;
    }>,
): Promise<string> => {
    const decryptedChunks: Uint8Array[] = [];

    for (const { cipherText, e, n } of cipherTexts) {
        const cipherBigInt = BigInt(cipherText);
        const decryptedChunk = await chunkBruteForce(cipherBigInt, n, e);
        if (decryptedChunk) {
            decryptedChunks.push(decryptedChunk);
        } else {
            throw new Error('Decryption failed for one of the chunks');
        }
    }

    // Combine all decrypted chunks
    const combinedBytes = new Uint8Array(
        decryptedChunks.reduce((acc, chunk) => acc + chunk.length, 0),
    );
    let offset = 0;
    for (const chunk of decryptedChunks) {
        combinedBytes.set(chunk, offset);
        offset += chunk.length;
    }

    return new TextDecoder().decode(combinedBytes).replace(/\0/g, '');
};

addEventListener(
    'message',
    async (
        event: MessageEvent<
            | {
                  type: 'encrypt';
                  email: string;
              }
            | {
                  type: 'decrypt';
                  cipherTexts: Array<{
                      cipherText: string;
                      e: number;
                      n: number;
                  }>;
              }
        >,
    ) => {
        if (event.data.type === 'encrypt') {
            const { email } = event.data;
            try {
                const encryptedEmail = await encryptEmail(email);
                postMessage({
                    type: 'encrypted',
                    data: encryptedEmail,
                });
            } catch (error) {
                postMessage({
                    type: 'error',
                    message: (error as Error).message,
                });
            }
        } else if (event.data.type === 'decrypt') {
            const { cipherTexts } = event.data;
            try {
                const decryptedEmail = await decryptEmail(cipherTexts);
                postMessage({
                    type: 'decrypted',
                    data: decryptedEmail,
                });
            } catch (error) {
                postMessage({
                    type: 'error',
                    message: (error as Error).message,
                });
            }
        }
    },
);
