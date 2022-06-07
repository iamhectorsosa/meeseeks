export default async function getafact() {
    try {
        const res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en", {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        const data = await res.json();
        return data.text;
    } catch (error) {
        console.log(error);
    }
}