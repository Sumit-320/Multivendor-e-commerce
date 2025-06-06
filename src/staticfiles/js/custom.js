let autocomplete;

function initAutoComplete(){
autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('id_address'),
    {
        types: ['geocode', 'establishment'],
        componentRestrictions: {'country': ['in']}, // currently for India only!
    })
// function to specify what should happen when the prediction is clicked
autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged (){
    var place = autocomplete.getPlace(); //it retrieves the place object (details) for the selected place.

    // If the place is not valid
    if (!place.geometry){
        document.getElementById('id_address').placeholder = "Start typing...";
    }
    else{// If the place is valid (i.e., the user selects a suggestion) 
        // console.log('place name=>', place.name)
    }
    var geocoder = new google.maps.Geocoder()
    var address = document.getElementById('id_address').value 

    // this function is to auto-fill the form values in my-restaurant page from google geocoding API
    geocoder.geocode({'address':address},function(results,status){
        if(status==google.maps.GeocoderStatus.OK){
            var latitude = results[0].geometry.location.lat()   // lat from api call 
            var longitude = results[0].geometry.location.lng()
            $('#id_latitude').val(latitude)
            $('#id_longitude').val(longitude)
            $('#id_address').val(address)
        }
    });

            // instead of manually assigning values, using loop
    console.log(place.address_components)
    for(var i=0; i<place.address_components.length; i++){
        for(var j=0; j<place.address_components[i].types.length; j++){
            if(place.address_components[i].types[j] == 'country'){
                $('#id_country').val(place.address_components[i].long_name);
            }
            if(place.address_components[i].types[j] == 'administrative_area_level_1'){
                $('#id_state').val(place.address_components[i].long_name);
            }
            if(place.address_components[i].types[j] == 'locality'){
                $('#id_city').val(place.address_components[i].long_name);
            }
            if(place.address_components[i].types[j] == 'postal_code'){
                $('#id_pin').val(place.address_components[i].long_name);
            }else{
                $('#id_pin').val("");
            }
        }
    }
}



$(document).ready(function(){
    $('.add_to_cart').on('click',function(e){
        e.preventDefault();
        // add to cart takes food id and url, then sends request to url=$... using AJAX get request 
        food_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        data = {
            food_id: food_id,
        }

        $.ajax({
            type: 'GET',
            url: url,  // url is addToCart views.py and it gets HttpResonse
            data:data,
            success:function(response){
            // refer to views.py
            console.log(response)
            if(response.status=='login_required'){
                swal(response.message,'','info').then(function(){
                    window.location = '/login'; // redirects to login page on clicking 'OK'
                })
            }
            if(response.status=='Failed'){
                swal(response.message,'','error')
            }else{
                $('#cart_counter').html(response.cart_counter['cart_count']);
                $('#qty-'+food_id).html(response.qty);

                // checkout sum
                applyCartAmount(
                    response.cart_amount['subtotal'],
                    response.cart_amount['tax_dict'],
                    response.cart_amount['grand_total'],
                )
            }
            } 
        })
    })
    $('.decrease_cart').on('click',function(e){
        e.preventDefault();
        // add to cart takes food id and url, then sends request to url=$... using AJAX get request 
        food_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        cart_id = $(this).attr('id');

        $.ajax({
            type: 'GET',
            url: url,  // url is addToCart views.py and it gets HttpResonse
            cart_id: cart_id,
            success:function(response){
            // refer to views.py
                if(response.status=='login_required'){
                    swal(response.message,'','info').then(function(){
                        window.location = '/login'; // redirects to login page on clicking 'OK'
                    })
                }
                if(response.status=='Failed'){
                    swal(response.message,'','error')
                }else{

                    $('#cart_counter').html(response.cart_counter['cart_count']);
                    $('#qty-'+food_id).html(response.qty);
                    applyCartAmount(
                        response.cart_amount['subtotal'],
                        response.cart_amount['tax_dict'],
                        response.cart_amount['grand_total'],
                    )
                    if(window.location.pathname=='cart/'){
                        removeCartItem(response.qty,cart_id);
                        checkEmptyCart();
                    }
                }
            }
        })
    })
    $('.delete_cart').on('click',function(e){
        e.preventDefault();
        // add to cart takes food id and url, then sends request to url=$... using AJAX get request 
        cart_id = $(this).attr('data-id');
        url = $(this).attr('data-url');
        
        $.ajax({
            type: 'GET',
            url: url,  // url is addToCart views.py and it gets HttpResonse
            success:function(response){
            // refer to views.py
                
                if(response.status=='Failed'){
                    swal(response.message,'','error')
                }else{
                    $('#cart_counter').html(response.cart_counter['cart_count']);
                    swal(response.status,response.message,"success")
                    applyCartAmount(
                        response.cart_amount['subtotal'],
                        response.cart_amount['tax_dict'],
                        response.cart_amount['grand_total'],
                    )
                    removeCartItem(0,cart_id);
                    checkEmptyCart();

                }
            }
        })
    })
    // cart qty 
    $('.item_qty').each(function(){
        var the_id = $(this).attr('id')
        var qty = $(this).attr('data-qty')
        $('#'+the_id).html(qty)
    })
    // remove empty cart
    function checkEmptyCart(){
        var count = document.getElementById('cart_counter').innerHTML
        if(count==0){
            document.getElementById("empty-cart").style.display="block";
        }
    }
    function applyCartAmount(subtotal,tax_dict,grand_total){
        if(window.location.pathname=='/cart/'){
            $('#subtotal').html(subtotal)
            $('#total').html(grand_total)
            for(key1 in tax_dict){
                for(key2 in tax_dict[key1]){
                    $('#tax-'+key1).html(tax_dict[key1][key2])
                }
            }
        }
    }

    function removeCartItem(cartItemQty,cart_id){
        if(cartItemQty<=0){
            document.getElementById("cart-item-"+cart_id).remove()
        }
    }

    $('.add_hour').on('click',function(e){
        e.preventDefault();
        var url = document.getElementById('add_hour_url').value
        var day = document.getElementById('id_day').value
        var from_hour = document.getElementById('id_from_hour').value
        var to_hour = document.getElementById('id_to_hour').value
        var is_closed = document.getElementById('id_is_closed').checked
        var csrf_token = $('input[name=csrfmiddlewaretoken]').val()  //jquery
        console.log(day,from_hour,to_hour,is_closed,csrf_token)
        if(is_closed){
            is_closed = 'True';
            condition = "day!=''";
        }else{
            is_closed = 'False';
            condition = "day!='' && from_hour!='' && to_hour!=''";
        }

        if(eval(condition)){
            $.ajax({
                type:'POST',
                url: url,
                data:{
                    'day':day,
                    'from_hour':from_hour,
                    'to_hour': to_hour,
                    'is_closed': is_closed,
                    'csrfmiddlewaretoken':csrf_token,
                },
                success: function(response){
                    if(response.status=='success'){
                        if(response.is_closed=='Closed'){
                            html = '<tr id="hour-'+response.id+'"><td><b>'+response.day+'</b></td><td>Closed</td><td><a href="#" class = "remove_hour" data-url="/vendor/opening-hours/remove/'+response.id+'/">Remove</a></td></tr>';
                        }else{
                            html = '<tr id="hour-'+response.id+'"><td><b>'+response.day+'</b></td><td>'+response.from_hour+' - '+ response.to_hour+'</td><td><a href="#" class = "remove_hour" data-url="/vendor/opening-hours/remove/'+response.id+'/">Remove</a></td></tr>';
                        }
                        $(".opening_hours").append(html)
                        document.getElementById("opening_hours").reset(); 
                    }else{
                         console.log(response.error)
                         swal(response.message,'',"error")
                    }
                }
            })
        }else{
            console.log(response.error)
            swal('Please enter all fields','','info')
        }
        
    })
    // doc ready close
    

    $(document).on('click','.remove_hour',function(e){
        e.preventDefault();
        url = $(this).attr('data-url');
        $.ajax({
            type:'GET',
            url:url,
            success:function(response){
                // console.log(response)
                if(response.status=='success'){
                    document.getElementById('hour-'+response.id).remove()
                }
            }
        })
    })

});



