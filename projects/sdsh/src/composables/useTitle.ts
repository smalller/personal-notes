/**
 * 设置 html Title  composables
 * @author LiQingSong
 */
import { ComputedRef, onMounted, Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import settings from '@/config/settings';
import { RoutesDataItem } from '@/utils/routes';

export default function useTitle(route: ComputedRef<RoutesDataItem> | Ref<RoutesDataItem>): void {


    const setTitle = (title: string): void => {
        document.title = `${title} - ${settings.siteTitle}`;
    }

    watch<RoutesDataItem, false>(route,() => {
        setTitle(route.value.title || '');
    })

    onMounted(()=> {
        setTitle(route.value.title);
    })

}
