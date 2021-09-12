const puppeteer = require("puppeteer");
const mongodb = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
const url = 'mongodb://localhost:27017/webscrapedata';
const mongoclient = mongodb.MongoClient;


app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());
//-----------------------Amazon Data----------------------------------------------->
async function start() {
    const url = 'mongodb://localhost:27017';
    const mongoclient = mongodb.MongoClient;
    const dbName = 'scrap';
    var browser = await puppeteer.launch();
    var page = await browser.newPage();
    await page.goto("https://www.amazon.in/s?k=iphones&dc&ref=a9_asc_1");
    //---------------------------------------------------------------------------------->
    //getting price
    //prices
    var prices = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small > div.a-row.a-size-base.a-color-base > a > span > span",
        (price) => {
            return price.map((x) => x.textContent);
        }
    );
    
        //converting prices array into Price object
    var Price = (Object.assign({}, prices));
    //separating each element in the object into separate object
    const splitprices = rs => {
        const amount = Object.keys(rs);
        const pres = [];
        for (let i = 0; i < amount.length; i++) {
            pres.push({
                'price': rs[amount[i]]
            });
        };
        return pres;
    };
    var productPrice = [];
    productPrice = splitprices(Price);
    //----------------------------------------------------------------------------->
    //--------------------------------------------------------------------------------->

    //getting name
    //names
    var names = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div > h2 > a > span",
        (name) => {
            return name.map((x) => x.textContent);
        }
    );
    
        //converting names array into Name object
    var Name = (Object.assign({}, names));
    //separating each element in the object into separate object
    const splitnames = obj => {
        const keys = Object.keys(obj);
        const res = [];
        for (let i = 0; i < keys.length; i++) {
            res.push({
                'name': obj[keys[i]]
            });
        };
        return res;
    };
    var Product = [];
    Product = splitnames(Name);
    //----------------------------------------------------------------------------->

    //getting review
    //reviews
    var reviews = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div.a-section.a-spacing-none.a-spacing-top-micro > div > span > span > a > i.a-icon.a-icon-star-small.a-star-small-4-5.aok-align-bottom",
        (review) => {
            return review.map((x) => x.textContent);
        }
    );
    
        //converting reviews array into Review object
    var Review = (Object.assign({}, reviews));
    //separating each element in the object into separate object
    const splitreviews = robj => {
        const rkeys = Object.keys(robj);
        const rres = [];
        for (let i = 0; i < rkeys.length; i++) {
            rres.push({
                'type': robj[rkeys[i]]
            });
        };
        return rres;
    };
    var ratings = [];
    ratings = splitreviews(Review);

    //----------------------------------------------------------------------------->
    //getting offers 
    //offers 
    var offers = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20 > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small > div.a-row.a-size-base.a-color-base > span",
        (offer) => {
            return offer.map((x) => x.textContent);
        }
    );
    for (let i = 0; i < offers.length; i++) {
        if (offers[i] == '') {
            offers[i] = 0;
        }
    }
    var n = -1;
    var offersx = [];
    for (let i = 0; i < offers.length; i++) {
        if (offers[i] != 0) {
            n++;
            offersx[n] = offers[i];
        }
    }
   
        //converting reviews array into Offer object
    var Offer = (Object.assign({}, offersx));
    //separating each element in the object into separate object
    const splitoffers = sobj => {
        const skeys = Object.keys(sobj);
        const sres = [];
        for (let i = 0; i < skeys.length; i++) {
            sres.push({
                'offers': sobj[skeys[i]]
            });
        };
        return sres;
    };
    var discounts = [];
    discounts = splitoffers(Offer);

    //----------------------------------------------------------------------------->
    //getting srcs
    //srcs 
    var srcs = await page.$$eval(
        "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > span > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div > span > a > div > img",
        (src) => {
            return src.map((x) => x.src);
        }
    );
    
    var imgUrl = (Object.assign({}, srcs));
    //separating each element in the object into separate object
    const splitsrcs = iobj => {
        const ikeys = Object.keys(iobj);
        const ires = [];
        for (let i = 0; i < ikeys.length; i++) {
            ires.push({
                'srcs': iobj[ikeys[i]]
            });
        };
        return ires;
    };
    var imgs = [];
    imgs = splitsrcs(imgUrl);


    //spread1--------------------------------------------------------------------->



    const datas = [];
    for (let i = 0; i < Product.length; i++) {
        datas[i] = {
            ...Product[i],
            ...productPrice[i],
            ...ratings[i],
            ...imgs[i],
            ...discounts[i]
        }
    }
    for (let i = 0; i < datas.length; i++) {
        console.log(datas[i]);
    }



    //===============================================================================>
    //mongodb
    async function main() {
        let client = await mongoclient.connect(url)
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('amazon');
        await collection.deleteMany({})
        const insertResult = await collection.insertMany(datas);
        client.close()
    }

    main();
    await browser.close();
}
start();
//-----------------------Flipkart Data----------------------------------------------->
async function startflip() {
    const url = 'mongodb://localhost:27017';
    const mongoclient = mongodb.MongoClient;
    const dbName = 'scrap';
    var browser = await puppeteer.launch();
    var page = await browser.newPage();
    await page.goto("https://www.flipkart.com/search?q=iphone&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&as-pos=1&as-type=HISTORY");
    //---------------------------------------------------------------------------------->
    //getting price
    //prices
    var prices = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-5-12.nlI3QM > div._3tbKJL > div > div._30jeq3._1_WHN1",
        (price) => {
            return price.map((x) => x.textContent);
        }
    );
  
        //converting prices array into Price object
    var Price = (Object.assign({}, prices));
    //separating each element in the object into separate object
    const splitprices = rs => {
        const amount = Object.keys(rs);
        const pres = [];
        for (let i = 0; i < amount.length; i++) {
            pres.push({
                'price': rs[amount[i]]
            });
        };
        return pres;
    };
    var productPrice = [];
    productPrice = splitprices(Price);
    //----------------------------------------------------------------------------->
    //--------------------------------------------------------------------------------->

    //getting name
    //names
    var names = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-7-12 > div._4rR01T",
        (name) => {
            return name.map((x) => x.textContent);
        }
    );

        //converting names array into Name object
    var Name = (Object.assign({}, names));
    //separating each element in the object into separate object
    const splitnames = obj => {
        const keys = Object.keys(obj);
        const res = [];
        for (let i = 0; i < keys.length; i++) {
            res.push({
                'name': obj[keys[i]]
            });
        };
        return res;
    };
    var Product = [];
    Product = splitnames(Name);
    //----------------------------------------------------------------------------->

    //getting review
    //reviews
    var reviews = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-7-12 > div.gUuXy- > span._2_R_DZ > span > span",
        (review) => {
            return review.map((x) => x.textContent);
        }
    );
        //converting reviews array into Review object
    var Review = (Object.assign({}, reviews));
    //separating each element in the object into separate object
    const splitreviews = robj => {
        const rkeys = Object.keys(robj);
        const rres = [];
        for (let i = 0; i < rkeys.length; i++) {
            rres.push({
                'brand': robj[rkeys[i]]
            });
        };
        return rres;
    };
    var ratings = [];
    ratings = splitreviews(Review);

    //----------------------------------------------------------------------------->
    //getting offers 
    //offers 
    var offers = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div._3pLy-c.row > div.col.col-5-12.nlI3QM > div._3tbKJL > div > div._3Ay6Sb > span",
        (offer) => {
            return offer.map((x) => x.textContent);
        }
    );
    // for (let i = 0; i < offers.length; i++) {
    //     if (offers[i] == '') {
    //         offers[i] = "Currently no offers available"
    //     }
    // }
        //converting reviews array into Offer object
    var Offer = (Object.assign({}, offers));
    //separating each element in the object into separate object
    const splitoffers = sobj => {
        const skeys = Object.keys(sobj);
        const sres = [];
        for (let i = 0; i < skeys.length; i++) {
            sres.push({
                'offers': sobj[skeys[i]]
            });
        };
        return sres;
    };
    var discounts = [];
    discounts = splitoffers(Offer);

    //----------------------------------------------------------------------------->
    //getting srcs
    //srcs 
    var srcs = await page.$$eval(
        "#container > div > div._36fx1h._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div > div > div > div > div > a > div.MIXNux > div._2QcLo- > div > div > img",
        (src) => {
            return src.map((x) => x.src);
        }
    );

        //converting reviews array into imgUrl object
    var imgUrl = (Object.assign({}, srcs));
    //separating each element in the object into separate object
    const splitsrcs = iobj => {
        const ikeys = Object.keys(iobj);
        const ires = [];
        for (let i = 0; i < ikeys.length; i++) {
            ires.push({
                'srcs': iobj[ikeys[i]]
            });
        };
        return ires;
    };
    var imgs = [];
    imgs = splitsrcs(imgUrl);


    //spreading the Data.--------------------------------------------------------------------->


    const datas = [];
    for (let i = 0; i < books.length; i++) {
        datas[i] = {
            ...Product[i],
            ...productPrice[i],
            ...ratings[i],
            ...imgs[i],
            ...discounts[i]
        }
    }
    for (let i = 0; i < datas.length; i++) {
        console.log(datas[i]);
    }



    //===============================================================================>
    //mongodb
    async function main() {
        let client = await mongoclient.connect(url)
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('flipkart');
        await collection.deleteMany({})
        const insertResult = await collection.insertMany(datas);
        client.close()
    }

    main();
    await browser.close();
}
startflip();















//---------------------------------------------------------------------->
//---------------------------------------------------------------------->
app.get("/amzn", async function(req, res) {
        try {
            //connceting db
            let client = await mongoclient.connect(url)
                //select db
            let db = client.db("scrap")
                //select collection and perform action
            let data = await db.collection("amazon").find({}).toArray();
            //close connection
            await client.close();
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: "No Data"
            })
        }

    })
    //---------------------------------------------------------------------->
app.get("/flip", async function(req, res) {
        try {
            //connceting db
            let client = await mongoclient.connect(url)
                //select db
            let db = client.db("scrap")
                //select collection and perform action
            let data = await db.collection("flipkart").find({}).toArray();
            //close connection
            await client.close();
            res.json(data)
        } catch (error) {
            res.status(500).json({
                message: "No Data"
            })
        }

    })
    //---------------------------------------------------------------------->
app.listen(3000, function() {
    console.log("App is runnning Successfully!")
})