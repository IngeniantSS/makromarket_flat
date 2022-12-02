import { Selector, t } from "testcafe";
var fs = require("fs");
var pageNo = 1;
const row = Selector(
  "#datagrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap > div > table > tbody > tr"
);
const tbody = Selector(
  "#datagrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap > div > table > tbody"
);
const cell = "test";

fixture`makro orders`
  .page`https://www.makromarketplace.co.za/Views/Landing/index.aspx`.beforeEach(
  async (t) => {
    await t
      .wait(2000)
      .maximizeWindow()
      .click('#w-node-_38fd7022-ca15-4feb-d45b-8a5907aea13d-07aea107 > div')
     // .click("#mainNav > li:nth-child(6) > a")
      .wait(500)
      .typeText("#user", "vickyclaassen@gmail.com")
      .typeText("#pass", "F*}Z37Njv&")
      .click("#LoginButton")
      .wait(3000);
  }
);

test("download pdfs", async (t) => {
  await t
    .click("#ManageOrdersNav > a > span")
    .click("#OrdersNav > a > span")
    .wait(3500)
    // .click(
    //  "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-pages > div:nth-child(6)"
    // )
    // .click(
    //   "#MainData > div > div > div.row > div:nth-child(1) > div > div > div.mmp-number-float > div.mmp-teal-description-6-mp"
    // ) // clicking the new orders box
    .wait(2000);

 // var linkPNo = Selector(".dx-page"); //dx-pages
  var linkPNo = Selector(".dx-pages").child('div');
  console.log(await linkPNo);
  var pageCount = await linkPNo.count;
  console.log(`this is page count   ${pageCount}`);
  //await t.wait(1000000000000000000000000000000000)
  for (var i = 0; i < pageCount; i++) {
    //  await t
   //   .debug();
    //var pageExists = await Selector(".dx-page").exists;
   // if(pageExists == true){
      await t.click(await linkPNo.nth(i));
      const row = Selector(
        "#datagrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap > div > table > tbody > tr"
      );
  
      const rowCount = await row.count;
      for (var j = 1; j < rowCount; j++) {
        // 0 is the header row so counting from 1
        console.log(`row number ${j}`);
        var cell = await row.nth(j).find("td");
        var makroOrderNoLink = await row.nth(j).find("td").nth(1);
        var status = await cell.nth(3).innerText;
  
        console.log(await `status ${status}`);
        var ordersArr = [];
        if ((await status) == "Open") {
          //  console.log(`open records count ${await cell.nth(3).count}`);
          var orderNo = await makroOrderNoLink.innerText;
          console.log(await `order no. ${await makroOrderNoLink.innerText}`);
          await t
            .click(await makroOrderNoLink)
            .wait(2500)
            .click(
              "#MainData > div > div.portlet-title > div.actions > div.btn-group > a" // clicking tools drop down
            )
            .click(
              "#MainData > div > div.portlet-title > div.actions > div.btn-group.open > ul > li:nth-child(1) > a" //clicking on export to pdf
            )
            .wait(2000);
          const trOrderDetails = await Selector(
            "#datatable_orderdetails > tbody > tr"
          );
          await t.hover(await trOrderDetails.nth(3));
          for (let k = 3; k < (await trOrderDetails.count); k++) {
            //const statusText = Selector('#OrderStatus_114858')
            const statusOpen = await trOrderDetails
              .nth(k)
              .find("td")
              .nth(1)
              .find("div a");
            const statusNoted = await Selector(trOrderDetails)
              .nth(k)
              .find("td")
              .nth(1)
              .find("div ul li a")
              .withText("Noted");
            const statusAccepted = await Selector(trOrderDetails)
              .nth(k)
              .find("td")
              .nth(1)
              .find("div ul li a")
              .withText("Accepted");
            const statusInProgress = await Selector(trOrderDetails)
              .nth(k)
              .find("td")
              .nth(1)
              .find("div ul li a")
              .withText("In Progress");
            await t
              .hover(statusOpen)
              .click(statusOpen)
              .wait(500)
              .click(statusNoted)
              .setNativeDialogHandler(() => true)
              .expect(Selector("div .modal-content").visible)
              .ok()
              .click(
                "button.btn.btn-success"
              ) //clicking ok button on the modal to confirm change status
              .wait(1000);
          }
          ordersArr.push(await orderNo);
          await t
            .navigateTo("https://www.makromarketplace.co.za/main.html#Orders") //navigating back to orders page
            .wait(3000)
            //  .debug() //observe the order statuses in table that they would filter to open
            // .click(
            //   "#MainData > div > div > div.row > div:nth-child(1) > div > div > div.mmp-number-float > div.mmp-teal-description-6-mp"
            // ) // clicking the new orders box
            .wait(2000);
  
          // add by sd
          if ((await j) == rowCount) {
            await t
              .click(
                "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-pages > div:nth-child(6)"
              )
              .wait(2000);
          }
  
        } else {
          console.log(`skipping row at ${j} as the status is equal to ${status}`);
          //   continue;
          // break;
        }
      }
  
      console.log(await ordersArr);
   // }
  

    }
});
