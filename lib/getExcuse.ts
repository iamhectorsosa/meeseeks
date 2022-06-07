export default async function getExcuse() {
    try {
        const res = await fetch("https://excuser.herokuapp.com/v1/excuse", {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        const data = await res.json();
        return data[0].excuse;
    } catch (error) {
        console.log(error);
    }
}
