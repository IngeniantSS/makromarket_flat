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
      .click("#mainNav > li:nth-child(6) > a")
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
  var hiddenPages = await linkPNo.filterHidden();
  console.log(`this is page count   ${pageCount}`);
  console.log(`this is hidden page count   ${await hiddenPages.count}`);
  //await t.wait(1000000000000000000000000000000000)
  for (var i = 0; i < 20; i++) {
    var pageExists = await Selector(".dx-page").exists;
    if(pageExists == true){
      await t.click(await Selector(".dx-pages").child("div").nth(i));
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
              .wait(1000)
              .click(
               "button.btn.btn-success"
                  //"body > div.bootbox.modal.fade.in > div > div > div.modal-footer > button.btn.btn-success" body > div.bootbox.modal.fade.in > div > div > div.modal-footer > button.btn.btn-success
            
               ) //clicking ok button on the modal to confirm change status
              .wait(1000);
            /*
                .hover(status)
                .click(status)
                .wait(500)
                .click(statusAccepted)
                .setNativeDialogHandler(() => true)
                .expect(Selector('div .modal-content').visible).ok()
                .click('body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success')
                .wait(1000)
                .hover(status)
                .click(status)
                .wait(500)
                .click(statusInProgress)
                .setNativeDialogHandler(() => true)
                .expect(Selector('div .modal-content').visible).ok()
                .click('body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success')
                .wait(1000)
                 */
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
  
          // Commented by sd
  
          // if ((await j) == 49 ) {
          //   console.log(
          //     `>>>>>>>>   this is line no ${j}, so clicking on the pagination`
          //   );
          //   await t
          //     .click(
          //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div:nth-child(4)"
          //     )
          //     .wait(3000);
          // }
        } else {
          console.log(`skipping row at ${j} as the status is equal to ${status}`);
          //   continue;
          // break;
        }
        //  break;
        // new code
        //     const pageNo = await Selector(
        //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div"
        //     );
        //     const pageNoCount = await pageNo.count;
        //     const page2 =  await Selector(
        //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div:nth-child(3)"
        //     );
        // console.log(`page no count = ${pageNoCount}`)
        //     for(let l = 0; l < pageNoCount; l++){
  
        //       if(await j == 49){
        //         await t.debug()
        //         const clickThisPageNo2 = await Selector(await pageNo.nth(l+3))
        //         await t.click(clickThisPageNo2)
        //         .wait(3000)
        //       }
        //       else if(j==99){
        //         await t.debug()
        //         const clickThisPageNo3 = await Selector(pageNo.find('div').nth(l+4))
        //         await t.click(clickThisPageNo3)
        //         .wait(3000)
  
        //       }
  
        //     }
      }
  
      console.log(await ordersArr);
    }
  

    }
  //   await t.click(await linkPNo.nth(i));
  //   const row = Selector(
  //     "#datagrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap > div > table > tbody > tr"
  //   );

  //   const rowCount = await row.count;
  //   for (var j = 1; j < rowCount; j++) {
  //     // 0 is the header row so counting from 1
  //     console.log(`row number ${j}`);
  //     var cell = await row.nth(j).find("td");
  //     var makroOrderNoLink = await row.nth(j).find("td").nth(1);
  //     var status = await cell.nth(3).innerText;

  //     console.log(await `status ${status}`);
  //     var ordersArr = [];
  //     if ((await status) == "Open") {
  //       //  console.log(`open records count ${await cell.nth(3).count}`);
  //       var orderNo = await makroOrderNoLink.innerText;
  //       console.log(await `order no. ${await makroOrderNoLink.innerText}`);
  //       await t
  //         .click(await makroOrderNoLink)
  //         .wait(2500)
  //         .click(
  //           "#MainData > div > div.portlet-title > div.actions > div.btn-group > a" // clicking tools drop down
  //         )
  //         .click(
  //           "#MainData > div > div.portlet-title > div.actions > div.btn-group.open > ul > li:nth-child(1) > a" //clicking on export to pdf
  //         )
  //         .wait(2000);
  //       const trOrderDetails = await Selector(
  //         "#datatable_orderdetails > tbody > tr"
  //       );
  //       await t.hover(await trOrderDetails.nth(3));
  //       for (let k = 3; k < (await trOrderDetails.count); k++) {
  //         //const statusText = Selector('#OrderStatus_114858')
  //         const statusOpen = await trOrderDetails
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div a");
  //         const statusNoted = await Selector(trOrderDetails)
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div ul li a")
  //           .withText("Noted");
  //         const statusAccepted = await Selector(trOrderDetails)
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div ul li a")
  //           .withText("Accepted");
  //         const statusInProgress = await Selector(trOrderDetails)
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div ul li a")
  //           .withText("In Progress");
  //         await t
  //           .hover(statusOpen)
  //           .click(statusOpen)
  //           .wait(500)
  //           .click(statusNoted)
  //           .setNativeDialogHandler(() => true)
  //           .expect(Selector("div .modal-content").visible)
  //           .ok()
  //           .click(
  //             "body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success"
  //           ) //clicking ok button on the modal to confirm change status
  //           .wait(1000);
  //         /*
  //             .hover(status)
  //             .click(status)
  //             .wait(500)
  //             .click(statusAccepted)
  //             .setNativeDialogHandler(() => true)
  //             .expect(Selector('div .modal-content').visible).ok()
  //             .click('body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success')
  //             .wait(1000)
  //             .hover(status)
  //             .click(status)
  //             .wait(500)
  //             .click(statusInProgress)
  //             .setNativeDialogHandler(() => true)
  //             .expect(Selector('div .modal-content').visible).ok()
  //             .click('body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success')
  //             .wait(1000)
  //              */
  //       }
  //       ordersArr.push(await orderNo);
  //       await t
  //         .navigateTo("https://www.makromarketplace.co.za/main.html#Orders") //navigating back to orders page
  //         .wait(3000)
  //         //  .debug() //observe the order statuses in table that they would filter to open
  //         // .click(
  //         //   "#MainData > div > div > div.row > div:nth-child(1) > div > div > div.mmp-number-float > div.mmp-teal-description-6-mp"
  //         // ) // clicking the new orders box
  //         .wait(2000);

  //       // add by sd
  //       if ((await j) == rowCount) {
  //         await t
  //           .click(
  //             "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-pages > div:nth-child(6)"
  //           )
  //           .wait(2000);
  //       }

  //       // Commented by sd

  //       // if ((await j) == 49 ) {
  //       //   console.log(
  //       //     `>>>>>>>>   this is line no ${j}, so clicking on the pagination`
  //       //   );
  //       //   await t
  //       //     .click(
  //       //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div:nth-child(4)"
  //       //     )
  //       //     .wait(3000);
  //       // }
  //     } else {
  //       console.log(`skipping row at ${j} as the status is equal to ${status}`);
  //       //   continue;
  //       // break;
  //     }
  //     //  break;
  //     // new code
  //     //     const pageNo = await Selector(
  //     //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div"
  //     //     );
  //     //     const pageNoCount = await pageNo.count;
  //     //     const page2 =  await Selector(
  //     //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div:nth-child(3)"
  //     //     );
  //     // console.log(`page no count = ${pageNoCount}`)
  //     //     for(let l = 0; l < pageNoCount; l++){

  //     //       if(await j == 49){
  //     //         await t.debug()
  //     //         const clickThisPageNo2 = await Selector(await pageNo.nth(l+3))
  //     //         await t.click(clickThisPageNo2)
  //     //         .wait(3000)
  //     //       }
  //     //       else if(j==99){
  //     //         await t.debug()
  //     //         const clickThisPageNo3 = await Selector(pageNo.find('div').nth(l+4))
  //     //         await t.click(clickThisPageNo3)
  //     //         .wait(3000)

  //     //       }

  //     //     }
  //   }

  //   console.log(await ordersArr);
  // }

  //   const row = Selector(
  //     "#datagrid > div > div.dx-datagrid-rowsview.dx-datagrid-nowrap > div > table > tbody > tr"
  //   );

  //   const rowCount = await row.count;
  //   for (var j = 1; j < rowCount; j++) {
  //     // 0 is the header row so counting from 1
  //     console.log(`row number ${j}`);
  //     var cell = await row.nth(j).find("td");
  //     var makroOrderNoLink = await row.nth(j).find("td").nth(1);
  //     var status = await cell.nth(3).innerText;

  //     console.log(await `status ${status}`);
  //     var ordersArr = [];
  //     if ((await status) == "Open") {
  //       //  console.log(`open records count ${await cell.nth(3).count}`);
  //       var orderNo = await makroOrderNoLink.innerText;
  //       console.log(await `order no. ${await makroOrderNoLink.innerText}`);
  //       await t
  //         .click(await makroOrderNoLink)
  //         .wait(2500)
  //         .click(
  //           "#MainData > div > div.portlet-title > div.actions > div.btn-group > a" // clicking tools drop down
  //         )
  //         .click(
  //           "#MainData > div > div.portlet-title > div.actions > div.btn-group.open > ul > li:nth-child(1) > a" //clicking on export to pdf
  //         )
  //         .wait(2000);
  //       const trOrderDetails = await Selector(
  //         "#datatable_orderdetails > tbody > tr"
  //       );
  //       await t.hover(await trOrderDetails.nth(3));
  //       for (let k = 3; k < (await trOrderDetails.count); k++) {
  //         //const statusText = Selector('#OrderStatus_114858')
  //         const statusOpen = await trOrderDetails
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div a");
  //         const statusNoted = await Selector(trOrderDetails)
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div ul li a")
  //           .withText("Noted");
  //         const statusAccepted = await Selector(trOrderDetails)
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div ul li a")
  //           .withText("Accepted");
  //         const statusInProgress = await Selector(trOrderDetails)
  //           .nth(k)
  //           .find("td")
  //           .nth(1)
  //           .find("div ul li a")
  //           .withText("In Progress");
  //         await t
  //           .hover(statusOpen)
  //           .click(statusOpen)
  //           .wait(500)
  //           .click(statusNoted)
  //           .setNativeDialogHandler(() => true)
  //           .expect(Selector("div .modal-content").visible)
  //           .ok()
  //           .click(
  //             "body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success"
  //           ) //clicking ok button on the modal to confirm change status
  //           .wait(1000);
  //         /*
  //           .hover(status)
  //           .click(status)
  //           .wait(500)
  //           .click(statusAccepted)
  //           .setNativeDialogHandler(() => true)
  //           .expect(Selector('div .modal-content').visible).ok()
  //           .click('body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success')
  //           .wait(1000)
  //           .hover(status)
  //           .click(status)
  //           .wait(500)
  //           .click(statusInProgress)
  //           .setNativeDialogHandler(() => true)
  //           .expect(Selector('div .modal-content').visible).ok()
  //           .click('body > div.bootbox.modal.fade.bootbox-confirm.in > div > div > div.modal-footer > button.btn.btn-success')
  //           .wait(1000)
  //            */
  //       }
  //       ordersArr.push(await orderNo);
  //       await t
  //         .navigateTo("https://www.makromarketplace.co.za/main.html#Orders") //navigating back to orders page
  //         .wait(3000)
  //       //  .debug() //observe the order statuses in table that they would filter to open
  //         // .click(
  //         //   "#MainData > div > div > div.row > div:nth-child(1) > div > div > div.mmp-number-float > div.mmp-teal-description-6-mp"
  //         // ) // clicking the new orders box
  //         .wait(2000);

  //       // add by sd
  //        if ((await j) == rowCount) {
  //         await t
  //           .click(
  //             "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-pages > div:nth-child(6)"
  //           )
  //           .wait(2000);
  //       }

  // // Commented by sd

  //       // if ((await j) == 49 ) {
  //       //   console.log(
  //       //     `>>>>>>>>   this is line no ${j}, so clicking on the pagination`
  //       //   );
  //       //   await t
  //       //     .click(
  //       //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div:nth-child(4)"
  //       //     )
  //       //     .wait(3000);
  //       // }
  //     } else {
  //       console.log(`skipping row at ${j} as the status is equal to ${status}`);
  //    //   continue;
  //       // break;
  //     }
  //     //  break;
  //           // new code
  //       //     const pageNo = await Selector(
  //       //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div"
  //       //     );
  //       //     const pageNoCount = await pageNo.count;
  //       //     const page2 =  await Selector(
  //       //       "#datagrid > div > div.dx-datagrid-pager.dx-pager > div.dx-page-sizes > div:nth-child(3)"
  //       //     );
  //       // console.log(`page no count = ${pageNoCount}`)
  //       //     for(let l = 0; l < pageNoCount; l++){

  //       //       if(await j == 49){
  //       //         await t.debug()
  //       //         const clickThisPageNo2 = await Selector(await pageNo.nth(l+3))
  //       //         await t.click(clickThisPageNo2)
  //       //         .wait(3000)
  //       //       }
  //       //       else if(j==99){
  //       //         await t.debug()
  //       //         const clickThisPageNo3 = await Selector(pageNo.find('div').nth(l+4))
  //       //         await t.click(clickThisPageNo3)
  //       //         .wait(3000)

  //       //       }

  //       //     }
  //   }

  //   console.log(await ordersArr);
});
