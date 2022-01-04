/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define(["require", "exports", "knockout",'ojs/ojmodel',
   'ojs/ojcollectiondataprovider',
  "ojs/ojbootstrap", "ojs/ojarraydataprovider", "ojs/ojbufferingdataprovider",
  "ojs/ojkeyset", "ojs/ojconverter-number",
  "text!data/departmentData.json",
  "ojs/ojknockout", "ojs/ojinputtext", "ojs/ojinputnumber", "ojs/ojlabel", "ojs/ojvalidationgroup", "ojs/ojformlayout", "ojs/ojtoolbar", "ojs/ojmessages", "ojs/ojtable"],
  function (require, exports, ko, Model, CollectionDataProvider,
    ojbootstrap_1, ArrayDataProvider, BufferingDataProvider,
    ojkeyset_1, NumberConverter,
    deptData) {
    function TableCrudViewModel() {
      this.connected = () => {
        document.title = "Loan Interest Calculator";
        // Implement further logic if needed
      };
      //
      // console.log('deptData: ', deptData)
	
	  self.activityDataProvider = ko.observable();   //gets data for Activities list
      self.itemsDataProvider = ko.observable(); 
	  
	 //---sHEN Comment
      this.deptArray = JSON.parse(deptData);
      console.log('this.deptArray: ', this.deptArray)
      this.deptObservableArray = ko.observableArray(this.deptArray);
      this.dataprovider = new BufferingDataProvider(new ArrayDataProvider(this.deptObservableArray, {
        keyAttributes: "accNo",
      }));
	  
	 // *///-----sHEN Comment
	  
      this.converter = new NumberConverter.IntlNumberConverter({
        useGrouping: false,
      });
      this.isEmptyTable = ko.observable(false);
      this.messageArray = ko.observableArray();
      this.groupValid = ko.observable();
      // intialize the observable values in the forms
		this.accNo = ko.observable();
		this.customerNo = ko.observable();
		this.loanAmount = ko.observable();
		this.noOfTenor = ko.observable();
		this.interestRate = ko.observable();
		this.interestAmount = ko.observable();
		this.tenorUnit = ko.observable();
		this.totalPayableAmount = ko.observable();
		
      this.firstSelected = ko.observable();
      this.disableSubmit = ko.observable(true);
	  
	  var RESTurl = "http://168.138.1.16:9002/demo-loan-services/api/calculateInterest";
	  var url = RESTurl;
	  function parseItem(response) {
		  console.log("IN PARSE ITEM");
            var img = 'css/images/product_images/jet_logo_256.png'
            if (response) {
              //if the response contains items, pick the first one
              if (response.items && response.items.length !== 0) { response = response.items[0]; }
              //if the response contains an image, retain it
              if (response.image !== null) { img = response['image']; }
              return {
                id: response['id'],
                totalPayableAmount: response['totalPayableAmount'],
                interestAmount: response['interestAmount'],
                interestRate: response['interestRate'],
                accNo: response['accNo'],
                noOfTenor: response['noOfTenor'],
                loanAmount: response['loanAmount'],
                customerNo: response['customerNo'],
                 tenorUnit: response['tenorUnit']
				 

              };
            }
          }
	  console.log("aftercheck ddd ROW new 2");
	    var itemModel = Model.Model.extend({
            urlRoot: url,
		  //  urlRoot: RESTurl,
            parse: parseItem,
            idAttribute: 'id'
          });

          self.myItem = new itemModel();
          self.itemCollection = new Model.Collection.extend({
            url: url,
            model: self.myItem,
            comparator: 'id'
          });
		  
		  self.myItemCol = new self.itemCollection();
		self.itemsDataProvider(new CollectionDataProvider(self.myItemCol));
      // Return true if the Create button should be dis7abled
      this.disableCreate = ko.computed(() => {
        return !this.accNo() || this.groupValid() === "invalidShown";
      });
      // Return true if the Remove and Update buttons should be disabled
      this.disableRemoveUpdate = ko.computed(() => {
        const firstSelected = this.firstSelected();
        return (!firstSelected ||
          !firstSelected.key ||
          this.groupValid() === "invalidShown");
      });
	  
	  ///shen
	  /*
	        self.addDepartment = function(formElement, event){
                    var recordAttrs = {DepartmentId: formElement.elements[0].value,
                        DepartmentName: formElement.elements[1].value,
                        ManagerId: "", LocationId: "",
                        links: {Employees: {rel: 'child', href: 'http://RESTServerIP:Port/stable/rest/Departments/' + formElement.elements[0].value + '/Employees'}}};
                    this.DeptCol().create(recordAttrs,{
                        'contentType': 'application/vnd.oracle.adf.resource+json',
                        error: function(jqXHR, textStatus, errorThrown){
                             console.log('Error in Create: ' + textStatus);
                        }
                    });
	  */
	  //shen
	  
	  
	     this.addRow1 = (event) => {
      
        $.post("http://localhost:8081/demo-loan-services/api/calculateInterest",
		{
           accNo: this.accNo(),
            customerNo: this.customerNo(),
            loanAmount: this.loanAmount(),
            noOfTenor: this.noOfTenor(),
			interestRate: this.interestRate(),
			interestAmount: this.interestAmount(),
			tenorUnit: this.tenorUnit(),
			totalPayableAmount: this.totalPayableAmount(),
        },
        function(data, status){
          window.location.href ="?ojr=tablecrud";
        },'json');
        return true;
      };
	  
	  this.addRow5 = (event) => {
	  $.post("http://localhost:8081/demo-loan-services/api/calculateInterest", 
	  {"accNo": this.accNo(), "customerNo": this.customerNo(), "loanAmount": this.loanAmount(),"noOfTenor": this.noOfTenor(),"interestRate":this.interestRate()},
	  function(data){
       console.log(data);
     })
	  }
	 ;
	  this.addRow = (event) => {
		  
		   //data: JSON.stringify(data);
	  $.ajax({
    url: "http://168.138.1.16:9002/demo-loan-services/api/calculateInterest",
    type: "POST",
	
   // data: {"event":{"accNo": this.accNo(), "customerNo": this.customerNo(), "loanAmount": this.loanAmount(),"noOfTenor": this.noOfTenor(),"interestRate":this.interestRate()}},
    data: JSON.stringify({"accNo": this.accNo(), "customerNo": this.customerNo(), "loanAmount": this.loanAmount(),"noOfTenor": this.noOfTenor(),"interestRate":this.interestRate()}),
    dataType:'json',
	contentType: "application/json; charset=utf-8",
    success: function (response) {
        console.log(response);
		//return response;
		
			    this.id = response['id'];
                this.totalPayableAmount= response['totalPayableAmount'];
                this.interestAmount= response['interestAmount'];
                this.interestRate = response['interestRate'];
                this.accNo = response['accNo'];
                this.noOfTenor= response['noOfTenor'];
                this.loanAmount= response['loanAmount'];
                this.customerNo= response['customerNo'];
                 this.tenorUnit= response['tenorUnit'];
				 					
				document.getElementById("accNo").value = response['accNo'];
				document.getElementById("totalPayableAmount").value = response['totalPayableAmount'];
				document.getElementById("interestAmount").value =  response['interestAmount'];
				document.getElementById("tenorUnit").value = "Days";
				  console.log("after printing response");
				  return response;
		
    },
    error: function(error){
        console.log("Something went wrong", error);
    }
	})
		
	  };
	 console.log("after calling Rest");
	   //sHEN COMMENT
	   self.newItem = ko.observableArray([]); //holds data for create item dialog
	   function setAuthHeader(xhr){
                    
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                }
	   self.addRow4 = function (event, data) {
		     console.log("IN ADD ROW new 2");
		var recordAttrs = {
			accNo: data.accNo.toString(),
            customerNo: data.customerNo.toString(),
            loanAmount: data.loanAmount.toString(),
            noOfTenor: data.noOfTenor.toString(),
			interestRate: data.interestRate.toString(),
			interestAmount: data.interestAmount.toString(),
			tenorUnit: data.tenorUnit.toString(),
			totalPayableAmount: data.totalPayableAmount.toString(),
		 };
		console.log("aftercheck fff ROW new 2 with recordattr:"+recordAttrs.toString());
		/*
		 *The myItemCol variable is a Collection object that uses the
		 *create() function to write a new model to the data service.
		 *It also adds this new model to the collection.
		 */
		self.myItemCol.create(JSON.stringify(recordAttrs.toString()), {
			wait: true,  //Waits for the server call before setting attributes
			//headers: {'Access-Control-Allow-Origin': '*','Access-Control-Allow-Headers': 'X-Token','Access-Control-Allow-Credentials':false,'AllowAllOrigins':true,'AllowCredentials':false,'AllowMethods':'POST'},
			contentType: 'application/json',
			dataType: 'json',
			// contentType: 'application/vnd.oracle.adf.resource+json',
			//origin:'*',
			//method: 'POST',
			//type: 'POST',
			success: function (Model, response) {
			  console.log('Successfully created new item');
			},
			error: function (jqXHR, textStatus, errorThrown) {
			  //console.log('Error in Create: ' + jqXHR.statusCode.caller);
			  console.log('Error in Create: ' + textStatus);
			}
		});
		
		//document.getElementById('createDialog').close();
	  }.bind(this);
	  
	   console.log("after ADD ROW new 2");
	  // think of this as a single record in the DB, or a single row in your table
          var Department = Model.Model.extend({
            urlRoot: this.serviceURL,
            parse: RESTurl,
            //parseSave: parseSaveDept,
            idAttribute: 'accNo'
          });

	  console.log("after ADD ROW new 2 extend");
      // Add a new row
      this.addRow2 = () => {
		  /*
		  var itemModel = Model.Model.extend({
            urlRoot: url,
		  //  urlRoot: RESTurl,
            parse: parseItem,
            idAttribute: 'id'
          });*/
		  console.log("IN ADD ROW");
        if (this.groupValid() !== "invalidShown") {
			
			
          const dept = {
            accNo: this.accNo(),
            customerNo: this.customerNo(),
            loanAmount: this.loanAmount(),
            noOfTenor: this.noOfTenor(),
			interestRate: this.interestRate(),
			interestAmount: this.interestAmount(),
			tenorUnit: this.tenorUnit(),
			totalPayableAmount: this.totalPayableAmount(),
          };
         /* this.dataprovider.addItem({
            metadata: { key: dept.accNo },
            data: dept,
          });*///shen
        }
      };
	 //sHEN COMMENT
 console.log("aftercheck 222 ROW new 2");
      // Reset all rows to discard buffered changes
      this.resetRows = () => {
        this.dataprovider.resetAllUnsubmittedItems();
        this.isEmptyTable(this.dataprovider.isEmpty() === "yes");
        this.messageArray([
          {
            severity: "confirmation",
            summary: "Changes have been reset.",
            autoTimeout: 4000,
          },
        ]);
      };
      this.findIndex = (key) => {
        const ar = this.deptObservableArray();
        for (let idx = 0; idx < this.deptObservableArray().length; idx++) {
          if (ar[idx].accNo === key) {
            return idx;
          }
        }
        return -1;
      };
      // Commit a row to the data source.  This is dependent on the data source.
      this.commitOneRow = (editItem) => {
        const idx = this.findIndex(editItem.item.metadata.key);
        let error;
        if (idx > -1) {
          if (editItem.operation === "update") {
            this.deptObservableArray.splice(idx, 1, editItem.item.data);
          }
          else if (editItem.operation === "remove") {
            this.deptObservableArray.splice(idx, 1);
          }
          else {
            error = {
              severity: "error",
              summary: "add error",
              detail: "Row with same key already exists",
            };
          }
        }
        else {
          if (editItem.operation === "add") {
            this.deptObservableArray.splice(this.deptObservableArray().length, 0, editItem.item.data);
          }
          else {
            error = {
              severity: "error",
              summary: editItem.operation + " error",
              detail: "Row for key cannot be found",
            };
          }
        }
        if (error) {
          return Promise.reject(error);
        }
        return Promise.resolve();
      };
      // Submit the unsubmitted items
      this.submitRows = () => {
        this.disableSubmit(true);
        // Get all the submittable items
        const editItems = this.dataprovider.getSubmittableItems();
        editItems.forEach((editItem) => {
          // Set each edit item to "submitting" status before data submission
          this.dataprovider.setItemStatus(editItem, "submitting");
          //DepartmentData
          // Commit data
          this.commitOneRow(editItem)
            .then(() => {
              // Set the edit item to "submitted" if successful
              this.dataprovider.setItemStatus(editItem, "submitted");
            })
            .catch((error) => {
              // Set the edit item back to "unsubmitted" with error if not successful
              this.dataprovider.setItemStatus(editItem, "unsubmitted", error);
              var errorMsg = {
                severity: error.severity,
                summary: error.summary,
                autoTimeout: 4000,
              };
              this.messageArray.push(errorMsg);
            });
        });
        this.messageArray([
          {
            severity: "confirmation",
            summary: "Changes have been submitted.",
            autoTimeout: 4000,
          },
        ]);
      };
      // Show all submittable edit items
      this.showSubmittableItems = (submittable) => {
        const textarea = document.getElementById("bufferContent");
        let textValue = "";
        submittable.forEach((editItem) => {
          textValue += editItem.operation + " ";
          textValue += editItem.item.metadata.key + ": ";
          textValue += JSON.stringify(editItem.item.data);
          if (editItem.item.metadata.message) {
            textValue +=
              " error: " + JSON.stringify(editItem.item.metadata.message);
          }
          textValue += "\n";
        });
        textarea.value = textValue;
      };
      // Listener for updating the form when row selection changes in the table
      this.firstSelectedRowChangedListener = (event) => {
        const itemContext = event.detail.value;
        if (itemContext && itemContext.data) {
          const dept = itemContext.data;
          this.accNo(dept.accNo);
          this.customerNo(dept.customerNo);
          this.loanAmount(dept.loanAmount);
          this.noOfTenor(dept.noOfTenor);
			this.tenorUnit(dept.tenorUnit);
			this.interestRate(dept.interestRate);
			this.interestAmount(dept.interestAmount);
			this.totalPayableAmount(dept.totalPayableAmount);
        }
      };
      this.hideTable = (hide) => {
        const table = document.getElementById("table");
        const noDataDiv = document.getElementById("noDataDiv");
        if (hide === true) {
          table.classList.add("oj-sm-hide");
          noDataDiv.classList.remove("oj-sm-hide");
        }
        else {
          table.classList.remove("oj-sm-hide");
          noDataDiv.classList.add("oj-sm-hide");
        }
      };
	  /*Shen comment
      this.dataprovider.addEventListener("submittableChange", (event) => {
        // BufferingDataProvider fires the "submittableChange" event whenever there is a change in the number of submittable items.
        // We can use this to update the UI.
        const submittable = event.detail;
        this.disableSubmit(submittable.length === 0);
        this.showSubmittableItems(submittable);
      });
      this.dataprovider.addEventListener("mutate", (event) => {
        if (this.isEmptyTable() === true && event.detail.add != null) {
          this.isEmptyTable(false);
        }
      });
      this.isEmptyTable.subscribe((newValue) => {
        this.hideTable(newValue);
      });
      this.isEmptyTable(this.dataprovider.isEmpty() === "yes");
	  */ //Shen comment
    }
	

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
	 console.log("Returning from crud view model");
    return TableCrudViewModel;
  }
);
