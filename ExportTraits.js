// =================================
// FLOVATAR TRAIT EXPORT SCRIPT FOR ADOBE ILLUSTRATOR
// ---------------------------------
// DESCRIPTION:
// Automated script that prompts the user to input a layer Group name 
// and then attempts to export all the groupItems within that Group
// into separate SVG files.
// ---------------------------------
// AUTHOR: 
// Spencer Kelly (Flovatar)
// ---------------------------------
// HOW TO USE:
// Copy this file into the Scripts folder within your Illustrator folder
// e.g. on Mac OS the file path is as follows:
// Applications/Adobe Illustrator 2023/Presets/en_GB/Scripts/
// =================================


showGUI();

function saveTraits(targetName, suffix) {

    var targetGroup = app.activeDocument.groupItems.getByName(targetName);

    try {
        if (app.documents.length > 0 ) {

            // Get the active Illustrator document
            var sourceDoc = app.activeDocument;

            // Get the folder to save the files into
            var destFolder = null;
            destFolder = Folder.selectDialog( 'Select folder for SVG files.', '~' );

            // Get the total number of traits to export
            var traitCount = targetGroup.groupItems.length;

            if (destFolder != null) {
                var options, i, sourceDoc, targetFile;	
                
                // Get the SVG options to be used.
                options = this.getOptions();
                // You can tune these by changing the code in the getOptions() function.

                // Loop through groupItems within the targetGroup
                for (var i = 0; i < traitCount; i++) {
                    // Set the layer group to be exported
                    var tempGroup = targetGroup.groupItems[i];
                    tempGroup.hidden = false;

                    // Create new Doc then export the target trait into that Doc
                    var newDoc = documents.add(DocumentColorSpace.RGB, activeDocument.width, activeDocument.height);
                    var newLayer = newDoc.layers[0];
                    var newGroup = tempGroup.duplicate(newLayer, ElementPlacement.INSIDE);

                    // Set the filename of the SVG to be saved
                    var newFilename = tempGroup.name.replace(/\s+/g, '-');
                    // Add suffix to the filename
                    newFilename = newFilename + suffix;

                    // Get the file to save the document as svg into
                    targetFile = this.getTargetFile(newFilename, '.svg', destFolder);

                    // Save as SVG
                    newDoc.exportFile(targetFile, ExportType.SVG, options);

                    // Close the newly created Doc
                    newDoc.close();
                }

                alert( 'Successfully saved '+ traitCount +' SVGs' );
            }
        }
        else{
            throw new Error('There are no document open!');
        }
    }
    catch(e) {
        alert( e.message, "Script Alert", true);
    }

}


/** Returns the options to be used for the generated files.
	@return ExportOptionsSVG object
*/
function getOptions()
{
	// Create the required options object
	var options = new ExportOptionsSVG();
	// See ExportOptionsSVG in the JavaScript Reference for available options
		
	// Set the options you want below:
	
	// For example, uncomment to set the compatibility of the generated svg to SVG Tiny 1.1	
	// options.DTD = SVGDTDVersion.SVGTINY1_1;
	
	// For example, uncomment to embed raster images
	// options.embedRasterImages = true;
	
	return options;
}

/** Returns the file to save or export the document into.
	@param docName the name of the document
	@param ext the extension the file extension to be applied
	@param destFolder the output folder
	@return File object
*/
function getTargetFile(groupName, ext, destFolder) {
	var newName = "";

	// if name has no dot (and hence no extension),
	// just append the extension
	if (groupName.indexOf('.') < 0) {
		newName = groupName + ext;
	} else {
		var dot = groupName.lastIndexOf('.');
		newName += groupName.substring(0, dot);
		newName += ext;
	}
	
	// Create the file object to save to
	var newFile = new File( destFolder + '/' + newName );
	
	// Preflight access rights
	if (newFile.open("w")) {
		newFile.close();
	}
	else {
		throw new Error('Access is denied');
	}
	return newFile;
}

function showGUI() {
    try {
        var gui = createGUI();    
        gui.show();
      
      } catch (e) {
        alert(e);   
      }
      
      function createGUI() {
        var gui = new Window("dialog", "Export Groups as SVGs");
        gui.alignChilren = ["fill", "fill"];
        var panelGroup = createGroup(gui, "row");
      
        //Input Fields
        var userInput = createTextField(panelGroup, "Group Name:", "");
        var userSuffix = createTextField(panelGroup, "Add suffix (optional):", "");
        // Buttons
        var buttons = createGroup(gui, "row");
        var cancelBtn = createButton(buttons, "Cancel", function() {
            gui.close();
        });
        var exportBtn = createButton(buttons, "Export", function() {
          try {
            saveTraits(userInput.text, userSuffix.text);
            gui.close();
          } catch (e) {
            alert(e);
          }
        });

        return gui;
      }
}

function createGroup(parent, orientation) {
    //Create Group
    var group = parent.add("group");
    group.orientation = orientation;
    //Return Group
    return group;
  }

function createTextField(parent, title, content) {
    //Create a group for title and field
    var group = createGroup(parent, "column");
    group.alignChildren = 'left';

    //Create title
    var title = group.add("statictext", undefined, title);
    var field = group.add("edittext", undefined, content);
    field.preferredSize = [200, 23];

    //Return the field as its all you'll use
    return field;
}

function createPanel(parent, title) {
    //Create Panel
    var panel = parent.add("panel", undefined, title);
    panel.orientation = "column";
    //Return panel
    return panel;
}

function createButton(parent, title, onClick) {
    //Create Button
    var button = parent.add("button", undefined, title);
    if (onClick !== undefined) button.onClick = onClick;
    //Return button
    return button;
}
