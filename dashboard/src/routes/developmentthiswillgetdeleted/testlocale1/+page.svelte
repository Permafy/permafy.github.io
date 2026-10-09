<script>
    import Locale from "$lib/resources/localization/locale.js";

    let currentTime = $state(Date.now());
    let milliseconds = $state(0);
    let number = $state(0);
    setInterval(() => {
        currentTime = (Date.now());
    }, 100);
</script>

<h1>Locale</h1>
<h2>{Locale.browserLanguage}</h2>
<p>{Locale.timestampToDateWithTime(currentTime)}</p>
<p>{Locale.timestampToDate(currentTime)}</p>
<p>{Locale.timestampToTime(currentTime)}</p>
<p>{Locale.timestampToClock(currentTime)}</p>
<hr>
<input bind:value={milliseconds} type="range" min="0" step="0.000001" max="1000000000" style="width:90%" />
<input bind:value={milliseconds} type="number" />
<p>{Locale.millisecondsToUpcoming(milliseconds)}</p>
<hr>
<input bind:value={number} type="range" min="-1000000000" step="0.000001" max="1000000000" style="width:90%" />
<input bind:value={number} type="number" />
<p>{Locale.numberWithDelimiter(number)}</p>
<p>{Locale.numberWithNotation(number)}</p>
<hr>
<p>{Locale.arrayToAndConjuction(["one", "two", "three"])}</p>
<p>{Locale.arrayToOrConjuction(["one", "two", "three"])}</p>