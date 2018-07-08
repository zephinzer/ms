export default {
  todoHandler: (description) => (
    (req, res) => res.status(418).json(`WIP: ${description}`)
  ),
};
