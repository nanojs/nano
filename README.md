nano JavaScript framework
=========================

[nano](http://nanojs.org) is a light-weight JavaScript framework for building rich UI in Web applications. Its highly extensible design lets you easily add your own functionality to the API with plugins.

Installation
------------

To use the **nano JavaScript framework** on your website include it in the `<head>` of the document:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Site</title>
    <script src="path/to/nano.js"></script>
  </head>
  <body>
		
    <!-- your content here -->
		
  </body>
</html>
```

If you're also using plugins with the framework remember that they *must* be included after the core API.

Using the framework
-------------------

The `nano()` function is the base of the framework. It allows you to implement the core functionalities of the API depending on the type of data passed. The function receives a single argument, whcih can be any of the following data types:

* **id [string]** (wraps the element with the specified ID with the API)
* **element [node]** (wraps the given DOM node with the API)
* **parameters [object]** (creates a new element using the parameters object)
* **onload [function]** (registers the function to the document onload event)

To locate an element with the ID "example", just call the `nano()` function with that ID. Once the element is found it is wrapped in the API.

For example, the following finds the element with the ID "example" and adds the class "test" to it:

```js
nano('example').addClass('test');
```

If you already have a DOM node and want to wrap it with the API, just pass the node object instead of the ID. This will return the same DOM node wrapped with the API functionality. When a DOM node is wrapped with the API, the reference to the original element can be found in the `node` property.

The `nano` object is also the global namespace for the API. All the general purpose functions of the framework are accessed from this object.

For example, the following finds all the elements with the specified class and hides each one of them:

```js
nano.find('css', 'test').each(function() {
  this.hide();
});
```

To create new elements you need to call the `nano()` function as a constructor, using the new keyword. When called as a constructor, the function expects the argument to be an object containing the parameters to use.

The following example creates a new `<div>` element with the content "This is an example", and attaches it to the `<body>` of the document:

```js
var div = new nano({
  tag   : 'div',
  parent: nano.body(),
  text  : 'This is an example'
});
```

Remember, you should only attach new nodes or modify the DOM once the document has fully loaded. To do this, always call functions which modify the DOM upon page load by passing a function as the argument which contains those calls. You can register as many functions to the onload of the document as you require.

```js
nano(function() {
  nano.body().add({
    tag : 'span',
    text: 'I was added!'
  });
});
```

Documentation
-------------

Full documentation, as well as tutorials, are available at [http://nanojs.org](http://nanojs.org).

Support
-------

For support, bugs and feature requests, please use the [issues](https://github.com/nanojs/nano/issues) section of this repository.

Contributing
------------

If you'd like to contribute new features, enhancements or bug fixes to the code base just follow these steps:

* Create a [GitHub](https://github.com/signup/free) account, if you don't own one already
* Then, [fork](https://help.github.com/articles/fork-a-repo) the [nano](https://github.com/nanojs/nano) repository to your account
* Create a new [branch](https://help.github.com/articles/creating-and-deleting-branches-within-your-repository) from the *develop* branch in your forked repository
* Modify the existing code, or add new code to your branch
* When ready, make a [pull request](http://help.github.com/send-pull-requests/) to the main repository

There may be some discussion regarding your contribution to the repository before any code is merged in, so be prepared to provide feedback on your contribution if required.

License
-------

Copyright 2008-2015 James Watts. All rights reserved.

Licensed under the GNU/GPL. Redistributions of the source code included in this repository must retain the copyright notice found in each file.
