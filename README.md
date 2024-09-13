<div align="center">

<img src="https://raw.githubusercontent.com/cern-sis/react-formule/master/docs/logo_horizontal.png" width="800px" />

[![Try our demo](https://img.shields.io/badge/try_our-🕹️_demo_🕹️-deepskyblue.svg?style=for-the-badge)](https://cern-sis.github.io/react-formule/)

</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![NPM Version](https://img.shields.io/npm/v/react-formule?style=flat-square&color=orchid)](https://www.npmjs.com/package/react-formule?activeTab=readme)
[![GitHub commits since tagged version](https://img.shields.io/github/commits-since/cern-sis/react-formule/latest?style=flat-square&color=orange)](https://github.com/cern-sis/react-formule/commits/master/)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/cern-sis/react-formule?style=flat-square)](https://github.com/cern-sis/react-formule/pulls)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-blue.svg?style=flat-square)](https://github.com/cern-sis/react-formule/issues)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-blue.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/cern-sis/react-formule/cypress.yml?style=flat-square&label=cypress)](https://github.com/cern-sis/react-formule/actions/workflows/cypress.yml)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/cern-sis/react-formule/deploy-demo.yml?style=flat-square&label=deploy-demo)](https://github.com/cern-sis/react-formule/actions/workflows/commit-lint.yml)

## :horse: What is Formule?

Formule is a **powerful, user-friendly, extensible and mobile-friendly form building library** based on [JSON Schema](https://json-schema.org/) and [RJSF](https://github.com/rjsf-team/react-jsonschema-form), which aims to make form creation easier for both technical and non-technical people.

It originated from the need of a flexible tool for physicists at CERN to create their custom forms in the [CERN Analysis Preservation](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) application (a process that was originally done by the CAP team who had to manually define the JSON schemas for every member experiment) in a zero-code fashion. This tool proved to be very useful for us to more easily scalate and expand, reaching a wider audience here at CERN. So, we thought it could also be useful for other people and decided to decouple it from CAP and release it as an open source library.

> [!WARNING]
> react-formule has just come out and is undergoing active development, so please feel free to share any issue you find with us and/or to contribute!

## :carousel_horse: How it looks like

A simple setup (see `./formule-demo`) could look like this:

<p align="center"><img src="https://raw.githubusercontent.com/cern-sis/react-formule/master/docs/demo.gif"/></p>

## :racehorse: How it works

Formule consists of the following main components:

- **`FormuleContext`**: Formule components need to be wrapped by a FormuleContext. It also allows you to provide an antd theme and your own custom fields and widgets.
- The form editor, which has been split into three different components that work together for more flexibility:
  - **`SelectOrEdit`** (or, separately, **`SelectFieldType`** and **`PropertyEditor`**): You can select fields to add to the form and customize their properties.
  - **`SchemaPreview`**: A tree view of the fields where you can rearrange or select fields to be edited.
  - **`FormPreview`**: A live, iteractive preview of the form which lets you toggle between the editable and the published version. If you only want to show the editable version, use **`EditablePreview`** instead.
- **`FormuleForm`**: You can use it to display a form (JSON Schema) generated by Formule. The editable version will be displayed by default. You can pass `isPublished` if you want to see the published version.

It also exports the following functions:

- **`initFormuleSchema`**: Inits the JSONSchema, **_needs_** to be run on startup.
- **`getFormuleState`**: Formule has its own internal redux state. You can retrieve it at any moment if you so require for more advanced use cases. If you want to continuosly synchronize the Formule state in your app, you can pass a callback function to FormuleContext instead (see below), which will be called every time the form state changes.

And the following utilities:

- **`CodeEditor`**: Useful if you want to edit the JSON schemas (or any other code) manually.
- **`CodeViewer`**: Useful if you want to visualize the JSON schemas that are being generated (as you can see in the demo).
- **`CodeDiffViewer`**: Useful if you want to compare two different JSON schemas, for example to see the changes since the last save.

### Field types

Formule includes a variety of predefined field types, grouped in three categories:

- **Simple fields**: `Text`, `Text area`, `Number`, `Checkbox`, `Switch`, `Radio`, `Select` and `Date` fields.
- **Collections**:
  - `Object`: Use it of you want to group fields or to add several of them inside of a `List`.
  - `List`: It allows you to have as many instances of a field or `Object` as you want.
  - `Accordion`: When containing a `List`, it works as a `List` with collapsible entries.
  - `Layer`: When containing a `List`, it works as a `List` whose entries will open in a dialog window.
  - `Tab`: It's commonly supposed to be used as a wrapper around the rest of the elements. You will normally want to add an `Object` inside and you can use it to separate the form in different pages or sections.
- **Advanced fields**: More complex or situational fields such as `URI`, `Rich/Latex editor`, `Tags`, `ID Fetcher` and `Code Editor`.

You can freely remove some of these predefined fields and add your own custom fields and widgets following the JSON Schema specifications. More details below.

All of these items contain different settings that you can tinker with, separated into **Schema Settings** (_generally_ affecting how the field _works_) and **UI Schema Settings** (_generally_ affecting how the field _looks like_).

## :horse_racing: Setting it up

### Installation

```sh
npm install react-formule
# or
yarn add react-formule
```

### Basic setup

```jsx
import {
    FormuleContext,
    SelectOrEdit,
    SchemaPreview,
    FormPreview,
    initFormuleSchema
} from "react-formule";

const useEffect(() => initFormuleSchema(), []);

<FormuleContext>
    <SelectOrEdit />
    <SchemaPreview />
    <FormPreview />
</FormuleContext>
```

### Customizing and adding new field types

Override (if existing) or create your own field types (rjsf type definitions) similarly to how it's done in `fieldTypes.jsx`, passing them as `customFieldTypes`. Implement your own custom fields and widgets (react components) by passing them as `customFields` and/or `customWidgets` (see `forms/fields/` and `forms/widgets/` for examples). If you also want to use a different published version of a field or widget, pass the component in `customPublishedFields` or `customPublishedWidgets`.

```jsx
const customFieldTypes = {
  advanced: {
    myfield: {
      title: ...
      ...
    }
  }
}

const customFields: {
  myfield: MyField  // react component
}

<FormuleContext
  theme={{token: {colorPrimary: "blue"}}} // antd theme
  customFieldTypes={customFieldTypes}
  customFields={customFields}
  customWidgets={...}
  customPublishedFields={...}
  customPublishedWidgets={...}>
// ...
</FormuleContext>
```

If you use Formule to edit existing JSON schemas that include extra fields (e.g. metadata fields) that you don't want to show up in the Formule editor (i.e. in `SchemaPreview` and `SchemaTree`), you can use `transformSchema` to exclude them:

```jsx
const transformSchema = (schema) => {
  // Remove properties here...
  return transformedSchema;
};

<FormuleContext transformSchema={transformSchema}>/* ... */</FormuleContext>;
```

### Handling and customizing errors

You can add a custom `transformErrors` function to process, edit or filter the errors from RJSF in the way that best suits our needs:

```jsx
const transformErrors = (errors) => {
  return errors.filter(...)
};

<FormuleForm transformErrors={transformErrors} />
```

### Syncing Formule state

If you want to run some logic in your application every time the current Formule state changes in any way (e.g. to run some action every time a new field is added to the form) you can pass a function to be called back when that happens:

```jsx
const handleFormuleStateChange = (newState) => {
  // Do something when the state changes
};

<FormuleContext synchonizeState={handleFormuleStateChange}>
  // ...
</FormuleContext>;
```

Alternatively, you can pull the current state on demand by calling `getFormuleState` at any moment.

> [!TIP]
> For more examples, feel free to browse around the [CERN Analysis Preservation](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) repository, where we use all the features mentioned above.

## :space_invader: Local demo & how to contribute

Apart from trying the online [demo](https://cern-sis.github.io/react-formule/) you can clone the repo and run `formule-demo` to play around. Follow the instructions in its [README](./formule-demo/README.md): it will explain how to install `react-formule` as a local dependency so that you can modify Formule and test the changes live in your host app, which will be ideal if you want to troubleshoot or contribute to the project.
