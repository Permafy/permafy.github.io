<script>
    import { browser } from "$app/environment";

    import TranslationMapper from "$lib/resources/localization/translation/mapper";
    import TranslationLoader from "$lib/resources/localization/translation/loader";

    import StoreSettings from "$lib/stores/settings";

    /**
     * @typedef {Object} Properties
     * @property {TranslationIndex.Key} key A translation key
     * @property {TranslationIndex.Text | null} text Text to fallback to if there is no translation text
     * @property {TranslationIndex.LanguageCode | null} lang A specific language code to use
     * @property {boolean?} html Whether to render as HTML or not
     * @property {Object<string, string>?} replacers Specify replacers to insert text in-place. Incompatible with HTML rendering for security.
     */
    /** @type {Properties} */
    let props = $props();
    let translationLang = $derived(props.lang
        || (browser ? TranslationMapper.mapSavedLanguageCode($StoreSettings.appLanguage) : "en"));
    
    let mappedText = $derived(TranslationMapper.map(props.key, translationLang, props.text));
    let renderedText = $derived(mappedText)
    $effect(() => {
        if (props.html || !props.replacers) {
            renderedText = mappedText;
            return;
        }

        for (const replacerKey in props.replacers) {
            renderedText = renderedText.replaceAll(replacerKey, `${props.replacers[replacerKey]}`);
        }
    });
</script>

{#if props.html}
    {@html renderedText}
{:else}
    {renderedText}
{/if}