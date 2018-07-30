<img src="https://founded.media/web/fapi.png" width="128">

# Founded Node.js Library

[![Founded API NPM](https://img.shields.io/npm/v/@lawscout/founded-api.svg)](https://www.npmjs.com/package/@lawscout/founded-api) ![License](https://img.shields.io/npm/l/@lawscout/founded-api.svg)

The Founded Node.js library provides access to the Founded and Auto Clerk APIs from applications written in server-side JavaScript.

Please keep in mind that this package is only for use with server-side Node and requires either a development or production api key.

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

| Key                | Type    | Required | Description
| ------------------ |:-------:| :------: | -----------
| `date`             | String  | Yes      | The date the company was incorporated. Use format `yyyy-mm-dd`
| `companyName`      | String  | Yes      | The name of the company
| `federal`          | Boolean | No       | A boolean indicating if the company is a federal company. If this parameter is not provided it will be treated as if `false` was set. *Note 1: If the company is not federal the province of the registered office will be assumed to be the incorporating province. Note 2: Federal companies are required to have 25% Canadian resident directors.*
| `fiscalYearEnd`    | String  | Yes      | The month of which the last day is to be used as the fiscal year end. Use full month name ex: `December`
| `registeredOffice` | Address | Yes      | The companies registered address. The province of the registered address will determine what type of organizational docs to prepare. [See address type format](#address-data)
| `directors`        | Array   | Yes      | An array of all company directors. [See director type format](#director-data)
| `officers`         | Array   | Yes      | An array of all company officers. At least 1 `President` is required. [See officer type format](#officer-data)
| `shareholders`     | Array   | Yes      | An array of all shareholders. At least 1 `voting` shareholder is required. [See shareholder type format](#shareholder-data)

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

| Key          | Type    | Required | Description
| ------------ |:-------:| :------: | -----------
| `street1`    | String  | Yes      | Line 1 of the address. ex. `10 Dundas St E`
| `street2`    | String  | No       | Line 2 of the address. ex. *`Unit 1001` Note: Line 2 can be an empty string*
| `city`       | String  | Yes      | The city or town of the address
| `region`     | String  | Yes      | The province or state or region of the address.  *Note: use region short codes. ex. `AB`, `BC`, `ON`, `QC`, etc.*
| `country`    | String  | Yes      | The full country name of the address. *Note: Use full country names. ex. `Canada`, `United States`, `Australia`, etc.*
| `postalCode` | String  | Yes      | The postal or zip code of the address. *ex. `M4M 1V6`, `90210`, etc.*

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

| Key                | Type    | Required | Description
| ------------------ |:-------:| :------: | -----------
| `firstName`        | String  | Yes      | The director's first name
| `lastName`         | String  | Yes      | The director's last name
| `address`          | Address | Yes      | The director's address. [See address type format](#address-data)
| `canadianResident` | Boolean | No      | The director's Canadian residency. *Note: Canadian residency status is only required for Federal corporations and can be ignored for provincial corporations*

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

| Key                | Type    | Required | Description
| ------------------ |:-------:| :------: | -----------
| `firstName`        | String  | Yes      | The officer's first name
| `lastName`         | String  | Yes      | The officer's last name
| `address`          | Address | Yes      | The officer's address [See address type format](#address-data)
| `positions`        | Array   | Yes      | Array of officer position strings. ex: `President`, `Secretary`, `CEO`. *Note: All corporations are required to have both a President and a Secretary*

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

| Key                | Type    | Required | Description
| ------------------ |:-------:| :------: | -----------
| `firstName`        | String  | Yes      | The shareholder's first name
| `lastName`         | String  | Yes      | The shareholder's last name
| `address`          | Address | Yes      | The shareholder's address [See address type format](#address-data)
| `classes`          | Array   | Yes      | Array of share class issuance objects. [See class issuance type format](#class-issuance-data)

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

| Key          | Type            | Required | Description
| ------------ |:---------------:| :------: | -----------
| `name`       | String          | Yes      | The name of the share class. ex. `A`, `B`, etc
| `total`      | Number          | Yes      | The total number of shares issued of this class type
| `price`      | Number          | Yes      | The total price paid for these shares. *Note: The price is expected to be a standard dollar amount or a number with 2 decimal places*
| `properties` | ClassProperties | Yes      | The class properties of this share class. [See class properties type format](#class-properties-data)

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

| Key         | Type    | Required | Description
| ----------- |:-------:| :------: | -----------
| `voting`    | Boolean | Yes      | True if the class is a voting class.
| `preferred` | Boolean | Yes      | True if the class is a preferred class.

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
