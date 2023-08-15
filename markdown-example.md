## Summary

Adds the initial entity tables for the ams-policy-service database.

<table>
<tr>
 <th>ERD After Migrations
 <th>LucidChart ERD Plan
<tr>
 <td><img width="600" src="https://github.com/Guaranteed-Rate/grins-mono/assets/112583934/2ce46de5-0458-4bb7-8c99-14ffa791f527" />
 <td><img width="600" src="https://github.com/Guaranteed-Rate/grins-mono/assets/112583934/1cdaa4d8-a27e-4148-9b0a-ddcfb17a4cca" />
</table>

## Related Links

[Jira - Main Ticket - GRINS-1424](https://jira.rate.com/browse/GRINS-1424)
[LucidChart - Schema For Migrations - [Policy Service] Policy Schema](https://lucid.app/lucidchart/3be5aae3-7472-4bd9-82bd-6298c93eff1c/edit?invitationId=inv_4f44e205-8364-481f-950c-06957cff8394&page=Tpy1WWJnyO2U#)

## How To Test

<details>
<summary>Expand Section</summary>

### Prerequisite Steps

1. If you have not already, create a local database for `ams_policy_service_dev` and populate your `.env.development.local` file with the correct connection information. By default, the password and username will be the same as the other local database used for the other services.

### Case: Run the migrations and ensure the tables are created

1. Local run `pnpm --filter ams-policy-service db:migrate:latest`
2. Verify that all of the tables mentioned in the [[Policy Service] Policy Schema](https://lucid.app/lucidchart/3be5aae3-7472-4bd9-82bd-6298c93eff1c/edit?invitationId=inv_4f44e205-8364-481f-950c-06957cff8394&page=Tpy1WWJnyO2U#) are created in the `ams_policy_service_dev` database.
3. Verify that the tables have the correct columns, data types, foreign keys, and T2 columns where applicable.

</details>

## Screenshots / Examples

<details>
<summary>Expand Section</summary>

<table>
<tr>
 <th>Description
 <th>Example
<tr>
 <td>ERD After Migrations Were Performed
 <td><img width="600" src="https://github.com/Guaranteed-Rate/grins-mono/assets/112583934/2ce46de5-0458-4bb7-8c99-14ffa791f527" />
<tr>
 <td>LucidChart ERD Plan
 <td><img width="600" src="https://github.com/Guaranteed-Rate/grins-mono/assets/112583934/1cdaa4d8-a27e-4148-9b0a-ddcfb17a4cca" />
</table>

</details>
