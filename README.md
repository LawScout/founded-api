<img src="https://founded.media/web/fapi.png" width="128">

# Founded Node.js Library

The Founded Node library provides access to the Founded and Auto Clerk APIs from applications written in server-side JavaScript.

Please keep in mind that this package is for use with server-side Node and required either a development or production api key.

## Installation

Install the package with:

    npm install @lawscout/founded-api

## Usage

The package needs to be configured with your api key.  Only use your production key in a production environment as you will be billed per bundle generated. Using a development key allows development and testing of all methods without incurring additional cost however all generated documents will be watermarked specimen.

``` js
const founded = require('founded-api')({ apiKey: 'my-api-key' });

const orgData = {...} // see documentation below for details

// get company organization documents
founded.getOrganizationBundle(orgData).then(pdf => {
    fs.writeFile(`./organization-docs.pdf`, pdf, (error) => {
        if (error) {
            console.error(error)
        }
    })
}).catch(error => {
    console.error(error)
})
```

## Data Requirements

### Organization Bundle Data

#### Example

``` js
{
    date: '2018-02-14',
    companyName: 'Beatles Shipping Inc.',
    federal: true,
    fiscalYearEnd: 'December',
    registeredOffice: <address>,
    directors: [<director>],
    officers: [<officer>],
    shareholders: [<shareholder>]
}
```

#### Format

| Key                | Type    | Description
| ------------------ |:-------:| -----------
| `date`             | String  | The date the company was incorporated. Use format `yyyy-mm-dd`
| `companyName`      | String  | The name of the company
| `federal`          | Boolean | A boolean indicating if the company is a federal company. If the company is not federal the province of the registered office will be assumed to be the incorporating province.
| `fiscalYearEnd`    | String  | The month of which the last day is to be used as the fiscal year end. Use full month name ex: `December`
| `registeredOffice` | Address | The companies registered address. The province of the registered address will determine what type of organizational docs to prepare. [See address type format](#address-data)
| `directors`        | Array   | An array of all company directors. [See director type format](#director-data)
| `officers`         | Array   | An array of all company officers. At least 1 `President` is required. [See officer type format](#officer-data)
| `shareholders`     | Array   | An array of all shareholders. At least 1 `voting` shareholder is required. [See shareholder type format](#shareholder-data)

---

### Address Data

#### Example

``` js
{
    street1: '123 Dundas St',
    street2: 'Apt 5',
    city: 'Toronto',
    region: 'ON',
    country: 'Canada',
    postalCode: 'M4M 4B7'
}
```

#### Format

| Key          | Type    | Description
| ------------ |:-------:| -----------
| `street1`    | String  | Line 1 of the address
| `street2`    | String  | Line 2 of the address
| `city`       | String  | The city or town of the address
| `region`     | String  | The province or state or region of the address.  Please use region short codes. ie. `AB`, `BC`, `ON`, `QC`, etc.
| `country`    | String  | The country of the address
| `postalCode` | String  | The postal code of zip code of the address

---

### Director Data

#### Example

``` js
{
    firstName: 'John',
    lastName: 'Lennon',
    address: <address>,
    canadianResident: true
}
```

#### Format

| Key                | Type     | Description
| ------------------ |:--------:| -----------
| `firstName`        | String   | The director's first name
| `lastName`         | String   | The director's last name
| `address`          | Address  | The director's address. [See address type format](#address-data)
| `canadianResident` | Boolean  | The director's Canadian residency

---

### Officer Data

#### Example

``` js
{
    firstName: 'John',
    lastName: 'Lennon',
    address: <address>,
    positions: ['President', 'CEO']
}
```

#### Format

| Key                | Type     | Description
| ------------------ |:--------:| -----------
| `firstName`        | String   | The officer's first name
| `lastName`         | String   | The officer's last name
| `address`          | Address  | The officer's address [See address type format](#address-data)
| `positions`        | Array    | Array of officer position strings. ex: `President`, `Secretary`, `CEO`

---

### Shareholder Data

#### Example

``` js
{
    firstName: 'John',
    lastName: 'Lennon',
    address: <address>,
    classes: [<class_issuance>]
}
```

#### Format

| Key                | Type     | Description
| ------------------ |:--------:| -----------
| `firstName`        | String   | The shareholder's first name
| `lastName`         | String   | The shareholder's last name
| `address`          | Address  | The shareholder's address [See address type format](#address-data)
| `classes`          | Array    | Array of share class issuance objects. [See class issuance type format](#class-issuance-data)

---

### Class Issuance Data

#### Example

``` js
{
    name: 'A',
    total: 1000,
    price: 250.00
    properties: <class_properties>
}
```

#### Format

| Key          | Type            | Description
| ------------ |:---------------:| -----------
| `name`       | String          | The name of the share class. ex. `A`, `B`, etc
| `total`      | Number          | The total number of shares issued of this class type
| `price`      | Address         | The total price paid for these shares
| `properties` | ClassProperties | The class properties of this share class. [See class properties type format](#class-properties-data)

---

### Class Properties Data

#### Example

``` js
{
    voting: true,
    preferred: true
}
```

#### Format

| Key         | Type    | Description
| ----------- |:-------:| -----------
| `voting`    | Boolean | True if the class is a voting class.
| `preferred` | Boolean | True if the class is a preferred class.

---

## Full Organization Example Data

``` js
{
    date: '2018-02-14',
    companyName: 'Beatles Shipping Inc.',
    fiscalYearEnd: 'December',
    registeredOffice: {
        street1: '123 Dundas St',
        street2: '',
        city: 'Toronto',
        region: 'ON',
        country: 'Canada',
        postalCode: 'M4M 4B7'
    },
    directors: [{
        firstName: 'John',
        lastName: 'Lennon',
        address: {
            street1: '1 Yonge St',
            street2: 'Unit 10',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M1M 1D6'
        },
        canadianResident: true
    },
    {
        firstName:'Paul',
        lastName:'McCartney',
        address: {
            street1: '100 Queen St',
            street2: '',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M4M 1B6'
        },
        canadianResident: true
    }],
    officers: [{
        firstName:'John',
        lastName:'Lennon',
        address: {
            street1: '1 Yonge St',
            street2: 'Unit 10',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M1M 1D6'
        },
        positions:['President']
    },
    {
        firstName:'Paul',
        lastName:'McCartney',
        address: {
            street1: '100 Queen St',
            street2: '',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M4M 1B6'
        },
        positions:['Secretary']
    }],
    shareholders: [{
        firstName:'John',
        lastName:'Lennon',
        address: {
            street1: '1 Yonge St',
            street2: 'Unit 10',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M1M 1D6'
        },
        classes: [{
            name: 'A',
            total: 2500,
            price: 25.00,
            properties: {
                voting: true,
                preferred: false
            }
        }]
    },
    {
        firstName:'Paul',
        lastName:'McCartney',
        address: {
            street1: '100 Queen St',
            street2: '',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M4M 1B6'
        },
        classes: [{
            name: 'A',
            total: 2500,
            price: 25.00,
            properties: {
                voting: true,
                preferred: false
            }
        }]
    },
    {
        firstName:'Geroge',
        lastName:'Harrison',
        address: {
            street1: '100 King St',
            street2: '',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M2M 1B6'
        },
        classes: [{
            name: 'A',
            total: 2500,
            price: 25.00,
            properties: {
                voting: true,
                preferred: false
            }
        }]
    },
    {
        firstName:'Ringo',
        lastName:'Star',
        address: {
            street1: '100 Front St',
            street2: '',
            city: 'Toronto',
            region: 'ON',
            country: 'Canada',
            postalCode: 'M3M 1B6'
        },
        classes: [{
            name: 'A',
            total: 2500,
            price: 25.00,
            properties: {
                voting: true,
                preferred: false
            }
        }]
    }]
}
```
