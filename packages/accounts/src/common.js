const CODE_NOT_FOUND = 404;
const CODE_SERVER_ERROR = 500;
const CODE_OK = 200;
const CODE_TODO = 418;

function createErrorHandler(code, message) {
  return {code, message}
}

export default {
  todoHandler: (description) => (
    (req, res) => res.status(CODE_TODO).json(`WIP: ${description}`)
  ),
  getMultipleResultsHandler:
    (responseHandler, additionalProperties) => (
      (results) => {
        if (results instanceof Array) {
          if (results.length === 0) {
            responseHandler.status(CODE_NOT_FOUND).send();
          } else {
            responseHandler.status(CODE_OK).json({
              data: results,
              count: results.length,
              timestamp: (new Date()).toISOString(),
              ...additionalProperties,
            });
          }
        } else {
          responseHandler.status(CODE_SERVER_ERROR).json(
            createErrorHandler(
              'ERROR_UNEXPECTED_NON_ARRAY',
              'no array was returned when one was expected',
            )
          );
        }
      }
    ),
  getSingleResultHandler:
    (responseHandler, additionalProperties) => (
      (results) => {
        if (results.length === 0) {
          responseHandler.status(CODE_NOT_FOUND).send();
        } else if (results.length === 1) {
          responseHandler.status(CODE_OK).json({
            data: results[0],
            timestamp: (new Date()).toISOString(),
            ...additionalProperties,
          });
        } else {
          responseHandler.status(CODE_SERVER_ERROR).json(
            createErrorHandler(
              'ERROR_UNEXPECTED_MULTIPLE_ENTITIES',
              'multiple entities found',
            )
          );
        }
      }
    ),
};
