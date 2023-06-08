export default function stringAvatar(name) {
    let nama = name.split(' ')

    if(nama.length > 2) {
        nama =nama.slice(0, 2)
    }
    nama = nama.map(el => el[0]).join("")
    return {
        sx: {
            bgcolor: stringToColor(name),
            cursor : "pointer"
        },
        children: `${nama}`,
    };
}


function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}