export default async function getAdvice() {
    try {
        const res = await fetch("https://programming-quotes-api.herokuapp.com/quotes/random", {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        const data = await res.json();
        return data.en;
    } catch (error) {
        console.log(error);
    }
}
