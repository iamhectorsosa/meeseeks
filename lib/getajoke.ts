export default async function getajoke() {
    try {
        const res = await fetch("https://icanhazdadjoke.com/", {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        const data = await res.json();
        // console.log(data.joke);
        return data.joke;
    } catch (error) {
        console.log(error);
    }
}
