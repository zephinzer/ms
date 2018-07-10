const CODE_NOT_FOUND = 404;
const CODE_SERVER_ERROR = 500;
const CODE_OK = 200;
const CODE_TODO = 418;

export default {
  todoHandler: (description) => (
    (req, res) => res.status(CODE_TODO).json(`WIP: ${description}`)
  ),
  getMultipleResultsHandler:
    (responseHandler, additionalProperties) => (
      (results) => {
        if (results instanceof Array) {
          responseHandler.status(CODE_OK).json({
            data: results,
            count: results.length,
            ...additionalProperties,
          });
        } else {
          responseHnadler.status(CODE_SERVER_ERROR).json({
            code: 'ERROR_UNEXPECTED_NON_ARRAY',
            message: 'no array was returned when one was expected',
          });
        }
      }
    ),
  getSingleResultHandler: (responseHandler) => (
    (results) => {
      if (results.length === 0) {
        responseHandler.status(CODE_NOT_FOUND).send();
      } else if (results.length === 1) {
        responseHandler.status(CODE_OK).json(results[0]);
      } else {
        responseHandler.status(CODE_SERVER_ERROR).json({
          code: 'ERROR_UNEXPECTED_MULTIPLE_ENTITIES',
          message: 'multiple entities found',
        });
      }
    }
  ),
};
