<script>
    // components
    import LocalizedString from "$lib/components/Localization/LocalizedString.svelte";

    import Locale from "$lib/resources/localization/locale.js";
    import TranslationMapper from "$lib/resources/localization/translation/mapper";
    import TranslationLoader from "$lib/resources/localization/translation/loader";
    
    import en from "$lib/resources/localization/translation/language/en.json";
    import languageInfo from "$lib/resources/localization/translation/language/language-info";

    import StoreSettings from "$lib/stores/settings";

    const languageCodeSet = (langCode) => {
        $StoreSettings.appLanguage = langCode;
    };

    /**
     * @type {TranslationIndex.Key}
     */
    let translationKey = $state("lang.name");
    let translationHtml = $state(false);
    let translationReplacers = $state(false);
    let translationReplacerKey = $state("");
    let translationReplacerValue = $state("");
</script>

<h1>TranslationMapper &amp; LocalizedString</h1>
<h2>{$StoreSettings.appLanguage} -&gt; {TranslationMapper.mapSavedLanguageCode($StoreSettings.appLanguage)}</h2>

<LocalizedString
    text={"Missing translation"}
    key={translationKey}
    html={translationHtml}
    replacers={translationReplacers ? {
        [translationReplacerKey]: translationReplacerValue
    } : null}
/>
<hr />
<select bind:value={translationKey}>
    {#each Object.keys(en) as translationKey}
        <option value={translationKey}>{translationKey}</option>
    {/each}
</select>
<br />
<label>
    <input type="checkbox" bind:checked={translationHtml} />
    html (incompatible with replacers)
</label>
<br />
<label>
    <input type="checkbox" bind:checked={translationReplacers} />
    replacers (re-check for re-render)
</label>
<br />
<input type="text" bind:value={translationReplacerKey} placeholder="translationReplacerKey" />
<input type="text" bind:value={translationReplacerValue} placeholder="translationReplacerValue" />

<hr />

<button onclick={() => languageCodeSet("browser")}>browser</button>
<hr />
{#each languageInfo.languageOrder as languageCode}
    <button onclick={() => languageCodeSet(languageCode)}>{languageCode}: {languageInfo.languageName[languageCode]}</button>
    <br />
{/each}