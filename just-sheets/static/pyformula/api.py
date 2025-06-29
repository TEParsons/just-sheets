import numpy as np


sheets = {}


def setData(sheet, data):
    """
    Sets the data for a given sheet

    Parameters
    ----------
    sheet : str
        Name of the sheet to set data for
    data : list[list]
        List of lists (JSON compatable) from which to create a numpy array which will be this 
        sheet's data
    """
    global sheets
    # make a numpy array from the data
    data = np.array(data)
    # update global
    sheets[sheet] = data


def calculate(sheet):
    """
    Perform all calculations in a sheet and return the result as a JSON array

    Parameters
    ----------
    sheet : _type_
        _description_

    Returns
    -------
    list[list]
        List of lists (JSON compatable) with the results of all calculations
    """
    global sheets
    # make an empty array to output
    content = np.empty(sheets[sheet].shape, dtype=str)
    # iterate through all cells
    for row, rowCells in enumerate(sheets[sheet]):
        for col, cell in enumerate(rowCells):
            # process each
            if isinstance(cell, str) and cell.startswith("="):
                # calculate if there's a formula
                try:
                    content[row, col] = eval(
                        cell[1:],
                        {
                            'sheets': sheets,
                            'data': sheets[sheet]
                        }
                    )
                except Exception as err:
                    # if anything goes wrong, use the error as value
                    content[row, col] = err
            else:
                # store as is otherwise
                content[row, col] = cell
    
    return content