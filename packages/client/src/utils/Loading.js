import Swal from "sweetalert2"

const Loading = Swal.mixin({
    title : "Tunggu",
    icon : "info",
    didOpen : () => {
        Swal.showLoading()
    },
    allowOutsideClick : false,
    allowEscapeKey : false
})

export default Loading