//control del menu
const btnToggle = document.querySelector('.btn-toggle');
const navMenu = document.querySelector('ul');
btnToggle.addEventListener('click',()=>{
    navMenu.classList.toggle('active');
})

//Menu active
function addMarkerCategory(){
    $(document).ready(function(){
        $('.category-name').on('click',function(){
            $(this).siblings().removeClass('cat-active');
            $(this).addClass('cat-active');
        })
    })
}

addMarkerCategory()





