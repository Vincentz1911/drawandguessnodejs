const DaGImage = require("./models/imageModel");

module.exports = function (app) {

    const dagcategory = ["animals", "body", "buildings", "clothing", "culture", "electronics", "fiction", "food", "geography",
        "holidays", "household", "moods", "music", "persons", "plants", "space", "sports", "tools", "transport", "weapons"]
    const daglanguage = ["english", "german", "french", "italian", "spanish", "danish"]


    app.get('/', (req, res) => {

        var chosencategory = "animals"
        DaGImage.find({ category: "animals" }, (err, DagImages) => {
 
            res.render('index', {
                title: 'HOME',
                dagcategory,
                chosencategory,
                page: 'index',
                DagImages
            })

        })
    })

    app.post('/', (req, res) => {

        console.log(req.body);
        var chosencategory = req.body.dagcategory;
        
        if (req.body.action != "formcat" ) {

            var newvalues = { $set: { 
            english: req.body.english,
            german: req.body.german,
            french: req.body.french ,
            italian: req.body.italian,
            spanish: req.body.spanish,
            danish: req.body.danish} };
        DaGImage.updateOne({id: req.body.action}, newvalues , (err, image) => {})
        }

        DaGImage.find({ category: req.body.dagcategory }, (err, DagImages) => {

            res.render('index', {
                title: 'HOME',
                dagcategory,
                chosencategory,
                page: 'index',
                DagImages
            })
        })

    })
 
    app.get('/additem', (req, res) => {
        res.render('additem', {
            title: 'Add Image',
            dagcategory,
            data: null
        })
    })

    app.post('/additem', (req, res) => {

        var dataobject = req.body;
        console.log(dataobject);

        const imageObject = new DaGImage({
            name: dataobject.name,
            category: dataobject.dagcategory,
            image: encodeURI(`http://drawandguess.epizy.com/images/assets/${dataobject.dagcategory}/${dataobject.name}.png`),
            english: dataobject.name
        })
        imageObject.save(err => { console.log(err) })

        console.log(imageObject);

        res.render('additem', {
            title: 'Add Image',
            dagcategory,
            data: imageObject
        })
    })

    //#region ADDLIST
    app.get('/addlist', (req, res) => {
        res.render('addlist', {
            title: 'Add, Remove and Delete Translation- and ImageLists',
            datacat: dagcategory,
            datalang: daglanguage
        })
    })

    app.post('/addlist', (req, res) => {

        res.render('addlist', {
            title: 'Add, Remove and Delete Translation- and ImageLists',
            datacat: dagcategory,
            datalang: daglanguage,
            page: 'addlist'
        })

        if (req.body.list == undefined || req.body.list == "") console.log("List contains no data");

        var dataobject = req.body

        var splitlist = dataobject.list.split(', ')

        //IF BODY IS IMAGENAMES THEN SPLIT LIST AND ADD NEW ENTRIES TO MONGODB
        //ELSE GET ALL FROM DB AND ADD THE SELECTED LANGUAGE TRANSLATION
        if (dataobject.isimagelist) {
            if (dataobject.removeimagelist) {

                DaGImage.deleteMany({ category: dataobject.dagcategory } , (err , collection) => {
                    if(err) console.log(err);
                    console.log(collection.result + " Record(s) deleted successfully");
                    console.log(collection);
                });

            } else {

                splitlist.forEach((imagename) => {
                    const imageObject = new DaGImage({
                        name: imagename,
                        category: dataobject.dagcategory,
                        image: encodeURI(`./public/images/${dataobject.dagcategory}/${imagename[0].toUpperCase()}${imagename.slice(1)}.png`),
 
                        // image: encodeURI(`http://drawandguess.epizy.com/images/assets/${dataobject.dagcategory}/${imagename[0].toUpperCase()}${imagename.slice(1)}.png`),
                        english: imagename
                    })

                    imageObject.save(err => { console.log(err) })

                })

            }
        } else {  
            DaGImage.find({ category: dataobject.dagcategory }, (err, DagImages) => {
                if (DagImages.length != splitlist.length && !dataobject.removelist) console.log("Lists doesn't match in size");
//test
                DagImages.forEach((imageObject, index) => {
                    if (dataobject.removeimagelist) { splitlist[index] = "" }

                    if (dataobject.daglanguage == 'english') { imageObject.english = splitlist[index] }
                    if (dataobject.daglanguage == 'german') { imageObject.german = splitlist[index] }
                    if (dataobject.daglanguage == 'french') { imageObject.french = splitlist[index] }
                    if (dataobject.daglanguage == 'italian') { imageObject.italian = splitlist[index] }
                    if (dataobject.daglanguage == 'spanish') { imageObject.spanish = splitlist[index] }
                    if (dataobject.daglanguage == 'danish') { imageObject.danish = splitlist[index] }
                    imageObject.save(err => { console.log(err) })
                })
            })
        }
    })
    //#endregion

    //#region EXTRACT
    app.get('/extract', (req, res) => {
        res.render(`extract`, {
            title: 'Extract',
            datalang: daglanguage
        })
    })

    app.post('/extract', (req, res) => {

        DaGImage.find({}, (err, DagImages) => {
            var language = req.body.daglanguage;
            console.log(language);
            var translation = "<resources>"

            DagImages.forEach((imageobject, index) => {
                if (language == 'english') { translation += `<string name="${imageobject.name}">${imageobject.english}</string>` }
                if (language == 'german') { translation += `<string name="${imageobject.name}">${imageobject.german}</string>` }
                if (language == 'frencch') { translation += `<string name="${imageobject.name}">${imageobject.frencch}</string>` }
                if (language == 'italian') { translation += `<string name="${imageobject.name}">${imageobject.italian}</string>` }
                if (language == 'spanish') { translation += `<string name="${imageobject.name}">${imageobject.spanish}</string>` }
                if (language == 'danish') { translation += `<string name="${imageobject.name}">${imageobject.danish}</string>` }

            })

            translation += "</resources>"
            res.render(`extract`, {
                title: 'Extract',
                datalang: daglanguage,
                datastring: translation
            })
        })
    })
    //#endregion
}