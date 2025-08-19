import { useSetAtom } from 'jotai';
import { programAtom, linearAtom, seriesAtom } from '@/store/app.ts';
import useCountry from '@/hooks/useCountry.ts';
import { fetchAvod, fetchLinear } from '@/api/service/content.ts';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/store';
import { ContentAssets } from '@/api/model/content.ts';
import { InitMetadata } from '@/api/model/metadata.ts';

const useAssetQuery = () => {
    const { country } = useCountry();
    const lang = 'en';
    const setLinearData = useSetAtom(linearAtom);
    const setAvodData = useSetAtom(programAtom);
    const setSeries = useSetAtom(seriesAtom);

    const { data } = useQuery({
        queryKey: [QueryKeys.CONTENT_ASSETS],
        queryFn: async () => {
            const linear = await fetchLinear({ country, lang });
            const avod = await fetchAvod({ country, lang });
            linear.map((item) => (item.metadata = InitMetadata));
            avod.avod.map((item) => (item.metadata = InitMetadata));
            avod.series.map((item) => (item.metadata = InitMetadata));
            setLinearData(linear);
            setAvodData(avod.avod);
            setSeries(avod.series);
            return {
                linear: linear,
                series: avod.series,
                program: avod.avod,
            } as ContentAssets;
        },
        staleTime: 1000 * 60 * 60,
    });

    return { contentAssets: data };
};
export default useAssetQuery;
