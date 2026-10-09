<script>
    import markdownTest from "./test.md?raw";
    import PenguinModMarkdown from "PenguinMod-MarkDown";
</script>

<h1>PenguinMod-MarkDownNew</h1>
{@html PenguinModMarkdown.parse(markdownTest, {
    permission: "trusted",
    inline: false,
    weight: "heavy"
})}