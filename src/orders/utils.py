import datetime
import simplejson as json


def generate_order_number(pk): # for placeorder field -- unique
    current_datetime = datetime.datetime.now().strftime('%Y%m%d%H%M%S') #20220616233810 + pk
    order_number = current_datetime + str(pk)
    return order_number


def order_total_by_vendor(order, vendor_id):
    total_data = json.loads(order.total_data)
    data = total_data.get(str(vendor_id))
    subtotal = 0
    tax = 0
    tax_dict = {}

    for key, val in data.items():
        subtotal += float(key)
        val = val.replace("'", '"')
        val = json.loads(val)
        tax_dict.update(val)

        # calculating the tax
        for i in val:
            for j in val[i]:
                tax += float(val[i][j])
    grand_total = float(subtotal) + float(tax)
    context = {
        'subtotal': subtotal,
        'tax_dict': tax_dict, 
        'grand_total': grand_total,
    }

    return context

def order_total_by_vendor(order,vendor_id):
    total_data = json.loads(order.total_data)
    data = total_data.get(str(vendor_id))
    subtotal = 0
    tax=0
    tax_dict={}

    for key, value in data.items():
        subtotal += float(key)
        value = value.replace("'", '"')  # normalize quotes if needed
        tax_items = json.loads(value)
        tax_dict.update(tax_items)
        for i in tax_items:
            for j in tax_items[i]:
                tax += float(tax_items[i][j])

    grand_total = float(subtotal)+float(tax)
    context={
        'subtotal':subtotal,
        'tax_dict':tax_dict,
        'grand_total':grand_total,
    }
    return context 
                        