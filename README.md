<img src="https://founded.media/web/fapi.png" width="128">

# Founded Node.js Library

The Founded Node library provides access to the Founded and Auto Clerk APIs from applications written in server-side JavaScript.

Please keep in mind that this package is for use with server-side Node that uses a Founded client token and a secret api key.

## Installation

Install the package with:

    npm install founded-api

## Usage

The package needs to be configured with your client token and api key

``` js
const founded = require('founded-api')({ client: 'my-client-token', apiKey: 'my-api-key' });

const orgData = {...}

founded.getOrganizationBundle(orgData).then(bundle => {
    // write the pdf bundle to a file
    fs.writeFile(`./bundle.pdf`, bundle, (error) => {
        if (error) {
            console.error(error)
        }
    })
}).catch(error => {
    console.error(error)
})
```

## Data Requirements

### Organization Data Format

| Key                | Type    | Description
| ------------------ |:-------:| -----------
| `date`             | String  | The date the company was incorporated. Use format `yyyy-mm-dd`.
| `companyName`      | String  | The name of the company.
| `fiscalYearEnd`    | String  | The month of which the last day is to be used as the fiscal year end. Use full month name ex: `December`
| `registeredOffice` | Address | The companies registered address. [See address type format](#address-data-format)
| `directors`        | Array   | An array of all company directors. [See director type format](#director-data-format)
| `officers`         | Array   | An array of all company officers. At least 1 `President` is required. [See officer type format](#officer-data-format)
| `shareholders`     | Array   | An array of all shareholders. At least 1 voting shareholder is required. [See shareholder type format](#shareholder-data-format)

### Address Data Format

| Key          | Type    | Description
| ------------ |:-------:| -----------
| `street1`    | String  | Line 1 of the address.
| `street2`    | String  | Line 2 of the address.
| `city`       | String  | The city or town of the address.
| `region`     | String  | The province or state or region of the address.
| `country`    | String  | The country of the address.
| `postalCode` | String  | The postal code of zip code of the address.

### Director Data Format

| Key                | Type     | Description
| ------------------ |:--------:| -----------
| `firstName`        | String   | The director's first name.
| `lastName`         | String   | The director's last name.
| `address`          | Address  | The director's address.
| `canadianResident` | Boolean  | The director's Canadian residency.

### Officer Data Format

| Key                | Type     | Description
| ------------------ |:--------:| -----------
| `firstName`        | String   | The director's first name.
| `lastName`         | String   | The director's last name.
| `address`          | Address  | The director's address.
| `positions`        | Array    | Array of officer position strings. ex: `President`, `Secretary`, `CEO`

### Shareholder Data Format

| Key                | Type     | Description
| ------------------ |:--------:| -----------
| `firstName`        | String   | The director's first name.
| `lastName`         | String   | The director's last name.
| `address`          | Address  | The director's address.
| `classes`          | Array    | Array of share class issuance objects. [See class issuance type format](#class-issuance-data-format)

### Class Issuance Data Format

| Key          | Type            | Description
| ------------ |:---------------:| -----------
| `name`       | String          | The name of the share class. ex. `A`, `B`, etc.
| `total`      | Number          | The total number of shares issued of this class type.
| `price`      | Address         | The total price paid for these shares.
| `properties` | ClassProperties | The class properties of this share class. [See class properties type format](#class-properties-data-format)

### Class Properties Data Format

| Key         | Type    | Description
| ----------- |:-------:| -----------
| `voting`    | Boolean | True if the class is a voting class.
| `preferred` | Boolean | True if the class is a preferred class.

### Organization Example Data

``` js
{
    date: '2018-2-14',
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
