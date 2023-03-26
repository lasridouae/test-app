export function printDiv(invoiceId, setting, customer, orderDetails, order, paramType) {
  const css = `body{margin-top:20px;background:#eee;}.invoice { padding: 30px;}.invoice h2 {margin-top: 0px;line-height: 0.8em;}.invoice .small {font-weight: 300;}.invoice hr {margin-top: 10px;border-color: #ddd;}.invoice .table tr.line {border-bottom: 1px solid #ccc;}.invoice .table td {border: none;}.invoice .identity {margin-top: 10px;font-size: 1.1em;font-weight: 300;}.invoice .identity strong {font-weight: 600;}.grid { position: relative;width: 100%;background: #fff;color: #666666;border-radius: 2px;margin-bottom: 25px;box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);}`;
  // const printContents = document.getElementById(divId).innerHTML;


  let invoiceHtml = '<div class="container"><div class="row"><!-- BEGIN INVOICE --><div class="col-xs-12"><div class="grid invoice"><div class="grid-body"><div class="invoice-title"><div class="row"><div class="col-xs-12"><img src="http://vergo-kertas.herokuapp.com/assets/img/logo.png" alt="" height="35"></div></div><br><div class="row"><div class="col-xs-12"><h2>invoice<br><span class="small"> ' + invoiceId + '</span></h2></div></div></div><hr><div class="row"><div class="col-xs-6"><address><strong>Billed To:</strong><br>' + setting.appAdresse ? setting.appAdresse : "" + '<br>Tél ' + setting.appPhone1 ? setting.appPhone1 : "" + '<br>' + setting.appPhone2 ? setting.appPhone2 : "" + '<br>Fix ' + setting.appFixe ? setting.appFixe : "" + '<br></address></div>';
  if (paramType != 'simple_sale'){
    invoiceHtml += '<div class="col-xs-6 text-right"> <address><strong>Shipped To:</strong><br>'+customer.name+',<br>'+customer.email+',<br>'+customer.adresse+'<br><abbr title="Phone">P:</abbr> '+customer.phone+'</address></div>';
  }
  invoiceHtml += '</div><div class="row"><div class="col-xs-6 text-right"><address><strong>Order Date:</strong><br>' + order.date + '</address></div></div><div class="row"><div class="col-md-12"><h3>ORDER SUMMARY</h3><table class="table table-striped"><thead><tr class="line"><td><strong>#</strong></td><td class="text-center"><strong>PODUCT DESCRIPTION</strong></td><td class="text-center"><strong>PRICE</strong></td><td class="text-right"><strong>QTY</strong></td><td class="text-right"><strong>TOTAL</strong></td></tr></thead><tbody>';
  
  let orderSummaryHTML = '';
  for (let i = 0; i < orderDetails.length; i++) {
    let order = orderDetails[i];
    orderSummaryHTML += `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${order.product.name}</strong></td>
        <td class="text-center">${order.product.unit_price - order.discount}</td>
        <td class="text-center"${order.quantity}</td>
        <td class="text-right">${(order.product.unit_price - order.discount) * order.quantity}.00 MAD</td>
      </tr>`;
  }



  if (paramType != 'simple_sale') {
    orderSummaryHTML += `
    <tr>
    <td colspan="3"></td>
    <td class="text-right"><strong>Subtotal</strong></td>
    <td class="text-right"><strong>${(order.grand_total + order.discount) - (
    order.grand_total * order.tax) / 100}</strong></td>
  </tr>
    <tr>
      <td colspan="3"></td>
      <td class="text-right"><strong>Discount</strong></td>
      <td class="text-right"><strong>${order.discount}</strong></td>
    </tr>
    <tr>
      <td colspan="3"></td>
      <td class="text-right"><strong>Taxes</strong></td>
      <td class="text-right"><strong>${order.tax}%</strong></td>
    </tr>
    `;
  }

  orderSummaryHTML += `
  <tr>
      <td colspan="3"></td>
      <td class="text-right"><strong>Total</strong></td>
      <td class="text-right"><strong>${order.grand_total}</strong></td>
    </tr>
  </tbody>
  </table>
  `;

  invoiceHtml += orderSummaryHTML;
  invoiceHtml += '</div></div></div></div></div><!-- END INVOICE --></div></div>';
  
  const pageContent = `<!DOCTYPE html><html><head>${css}</head><body onload="window.print()">${invoiceHtml}</html>`;
  let popupWindow: Window;
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    popupWindow = window.open(
      '',
      '_blank',
      'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
    );
    popupWindow.window.focus();
    popupWindow.document.write(pageContent);
    popupWindow.document.close();
    popupWindow.onbeforeunload = event => {
      popupWindow.close();
    };
    popupWindow.onabort = event => {
      popupWindow.document.close();
      popupWindow.close();
    };
  } else {
    popupWindow = window.open('', '_blank', 'width=600,height=600');
    popupWindow.document.open();
    popupWindow.document.write(pageContent);
    popupWindow.document.close();
  }

}