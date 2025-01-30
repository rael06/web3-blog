import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Blog", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Blog = await hre.ethers.getContractFactory("Blog");

    const blog = await Blog.deploy("My Blog");
    return { blog, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right name", async function () {
      const { blog } = await loadFixture(deployFixture);

      expect(await blog.name()).to.equal("My Blog");
    });

    it("Should set the right owner", async function () {
      const { blog, owner } = await loadFixture(deployFixture);

      expect(await blog.owner()).to.equal(owner.address);
    });

    it("Should create and fetch posts", async function () {
      const { blog } = await loadFixture(deployFixture);
      await blog.createPost("Title 1", "Content 1");
      await blog.createPost("Title 2", "Content 2");

      const posts = await blog.fetchPosts();
      expect(posts[0].title).to.equal("Title 1");
      expect(posts[0].content).to.equal("Content 1");

      expect(posts[1].title).to.equal("Title 2");
      expect(posts[1].content).to.equal("Content 2");
    });

    it("Should update a post", async function () {
      const { blog } = await loadFixture(deployFixture);

      await blog.createPost("Title 1", "Content 1");

      await blog.updatePost(1, "Title 2", "Content 2", false);

      const posts = await blog.fetchPosts();
      expect(posts[0].title).to.equal("Title 2");
      expect(posts[0].content).to.equal("Content 2");
      expect(posts[0].isPublished).to.equal(false);
    });
  });
});
