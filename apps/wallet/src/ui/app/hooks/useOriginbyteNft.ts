// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useRpcClient } from '@mysten/core';
import { useQuery } from '@tanstack/react-query';

import { NftClient } from '../helpers/NftClient';
import { parseIpfsUrl } from '_hooks';

export function useOriginbyteNft(nftId: string | null) {
    const rpc = useRpcClient();
    return useQuery(
        ['originbyte-nft', nftId],
        async () => {
            const client = new NftClient(rpc);
            const nfts = await client.getNftsById({ objectIds: [nftId!] });
            const nft = nfts[0];
            if (nft) {
                return {
                    ...nft,
                    fields: {
                        ...nft.fields,
                        url: parseIpfsUrl(nft.fields?.url ?? ''),
                    },
                };
            }
            return null;
        },
        {
            enabled: !!nftId,
        }
    );
}
